import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AckPolicy, connect, JetStreamClient, NatsConnection, RetentionPolicy } from 'nats';
import { WinstonLoggerService } from '@event-driven-microservices/logger';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private connection: NatsConnection;
  private jetStream: JetStreamClient;
  private activeProcessing = new Set<Promise<any>>();
  private isShuttingDown = false;
  private processingLoop: Promise<void> | null = null;
  constructor(private readonly logger: WinstonLoggerService) {}

  async onModuleInit() {
    try {
      this.connection = await connect({
        servers: [process.env.NATS_SERVERS || 'nats://nats:4222'],
      });
      this.jetStream = this.connection.jetstream();
      this.logger.log('NATS connection established successfully');

    } catch (error) {
      this.logger.error('Failed to initialize NATS connection', error.stack);
      throw error;
    }
  }

  async onModuleDestroy() {
    this.logger.log('Starting graceful shutdown of message processor');

    this.isShuttingDown = true;

    if (this.processingLoop) {
      this.logger.log('Waiting for processing loop to stop');
      await this.processingLoop;
    }

    if (this.activeProcessing.size > 0) {
      this.logger.log(`Waiting for ${this.activeProcessing.size} active message processes to complete`);
      await Promise.allSettled(Array.from(this.activeProcessing));
      this.logger.log('All active message processing completed');
    }

    if (this.connection) {
      await this.connection.close();
      this.logger.log('NATS connection closed');
    }
  }

  async subscribeFacebookEvents(handler: (data: any) => void): Promise<void> {
    try {
      const jsm = await this.connection.jetstreamManager();

      const streamName = 'FACEBOOK_EVENTS';
      try {
        await jsm.streams.info(streamName);
        this.logger.log(`Stream ${streamName} already exists`);
      } catch (error) {
        if (error.code === '404') {
          await jsm.streams.add({
            name: streamName,
            subjects: ['facebook.event'],
            retention: RetentionPolicy.Workqueue,
            max_age: 24 * 60 * 60 * 1000_000_000,
            max_msgs: 10000,
          });
          this.logger.log(`Created stream ${streamName}`);
        } else {
          throw error;
        }
      }

      const consumerName = 'fb-collector';
      try {
        await jsm.consumers.info('FACEBOOK_EVENTS', consumerName);
      } catch (error) {
        await jsm.consumers.add('FACEBOOK_EVENTS', {
          durable_name: consumerName,
          ack_policy: AckPolicy.Explicit,
          max_deliver: 3,
        });
      }

      const consumer = await this.jetStream.consumers.get('FACEBOOK_EVENTS', consumerName);

      this.processingLoop = this.processMessages(consumer, handler);

    } catch (error) {
      throw error;
    }
  }

  private async processMessages(consumer: any, handler: (data: any) => void): Promise<void> {
    this.logger.log('Starting message processing loop');

    while (!this.isShuttingDown) {
      try {
        const messages = await consumer.fetch({
          max_messages: 10,
          expires: 5000
        });

        const processingPromises = [];

        for await (const msg of messages) {
          if (this.isShuttingDown) {
            msg.nak();
            break;
          }

          const processingPromise = this.processMessage(msg, handler)
              .finally(() => {
                this.activeProcessing.delete(processingPromise);
              });

          processingPromises.push(processingPromise);
          this.activeProcessing.add(processingPromise);
        }

        await Promise.allSettled(processingPromises);

      } catch (error) {
        if (error.code === '408') {
          continue;
        }

        if (this.isShuttingDown) {
          this.logger.log('Processing stopped due to shutdown');
          break;
        }

        console.error('Error in message processing loop:', error);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    this.logger.log('Message processing loop stopped');
  }

  private async processMessage(msg: any, handler: (data: any) => void): Promise<void> {
    try {
      const data = JSON.parse(msg.string());
      await handler(data);
      msg.ack();
      this.logger.log('Message processed and acknowledged');
    } catch (error) {
      console.error('Error processing message:', error);
      msg.nak();
    }
  }
}
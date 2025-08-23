import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { AckPolicy, connect, JetStreamClient, NatsConnection } from 'nats';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private connection: NatsConnection;
  private jetStream: JetStreamClient;

  async onModuleInit() {
    try {
      this.connection = await connect({
        servers: [process.env.NATS_SERVERS || 'nats://nats:4222'],
      });

      this.jetStream = this.connection.jetstream();

    } catch (error) {
      throw error;
    }
  }

  async onModuleDestroy() {
    if (this.connection) {
      await this.connection.close();
    }
  }

  async subscribeFacebookEvents(handler: (data: any) => void): Promise<void> {
    try {
      const jsm = await this.connection.jetstreamManager();

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
      this.processMessages(consumer, handler);

    } catch (error) {
      throw error;
    }
  }

  private async processMessages(consumer: any, handler: (data: any) => void) {
    while (true) {
      try {
        const messages = await consumer.fetch({
          max_messages: 10,
          expires: 5000
        });

        for await (const msg of messages) {
          try {
            const data = JSON.parse(msg.string());
            await handler(data);
            msg.ack();
          } catch (error) {
            msg.nak();
          }
        }

      } catch (error) {
        if (error.code === '408') {
          continue;
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { connect, credsAuthenticator, JetStreamClient, NatsConnection } from 'nats';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private connection: NatsConnection;
  private jetStream: JetStreamClient;
  private activePublishes = new Set<Promise<any>>();
  private isShuttingDown = false;

  constructor(
      private token: string,
      private nkey: string,
      private servers: string[],
  ) {}

  async onModuleInit() {
    try {
      const credsContent = this.createCreds(this.token, this.nkey);

      this.connection = await connect({
        servers: this.servers,
        authenticator: credsAuthenticator(Buffer.from(credsContent, 'utf8')),
      });

      this.jetStream = this.connection.jetstream();
    } catch (error) {
      throw error;
    }
  }

  createCreds (token: string, nkey: string) {
    return `-----BEGIN NATS USER JWT-----
${token}
------END NATS USER JWT------

************************* IMPORTANT *************************
NKEY Seed printed below can be used to sign and prove identity.
NKEYs are sensitive and should be treated as secrets.

-----BEGIN USER NKEY SEED-----
${nkey}
------END USER NKEY SEED-----

*************************************************************`
  }

  async onModuleDestroy() {
    console.log('Starting graceful shutdown');
    this.isShuttingDown = true;

    if (this.activePublishes.size > 0) {
      console.log(`Waiting for ${this.activePublishes.size} active publishes to complete`);
      await Promise.allSettled(Array.from(this.activePublishes));
      console.log('All active publishes completed');
    }

    await this.connection?.close();
    console.log('NATS connection closed');
  }

  isShutdownInProgress(): boolean {
    return this.isShuttingDown;
  }

  async publishFacebookEvent(data: any): Promise<void> {
    if (this.isShuttingDown) {
      throw new Error('shutting down');
    }

    const payload = JSON.stringify(data);
    return this.publishWithTracking('facebook.event', payload);
  }

  async publishTiktokEvent(data: any): Promise<void> {
    if (this.isShuttingDown) {
      throw new Error('shutting down');
    }

    const payload = JSON.stringify(data);
    return this.publishWithTracking('tiktok.event', payload);
  }

  private async publishWithTracking(subject: string, payload: string): Promise<void> {
    const publishPromise = this.jetStream
        .publish(subject, payload, { timeout: 15000,})
        .then((pubAck) => {
          console.log(`Event published successfully to ${subject}. Sequence: ${pubAck.seq}`);
          this.activePublishes.delete(publishPromise);
          return pubAck;
        })
        .catch((error) => {
          console.error(`Failed to publish event to ${subject}`, error.message);
          this.activePublishes.delete(publishPromise);
          throw error;
        });

    this.activePublishes.add(publishPromise);
    return;
  }
}
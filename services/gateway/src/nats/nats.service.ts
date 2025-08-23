import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, JetStreamClient, NatsConnection, credsAuthenticator } from 'nats';

@Injectable()
export class NatsService implements OnModuleInit, OnModuleDestroy {
  private connection: NatsConnection;
  private jetStream: JetStreamClient;

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
    await this.connection?.close();
  }

  async publishFacebookEvent(data: any): Promise<void> {
    const payload = JSON.stringify(data);
    const sizeInBytes = Buffer.byteLength(payload, 'utf8');
    const sizeInMB = (sizeInBytes / 1024 / 1024).toFixed(2);

    console.log(`Publishing to JetStream: ${sizeInBytes} bytes (${sizeInMB} MB)`);

    try {
      const pubAck = await this.jetStream.publish('facebook.event', payload, {
        timeout: 15000,
      });
      console.log(`Event published successfully. Sequence: ${pubAck.seq}`);
    } catch (error) {
      console.error(`Failed to publish event (${sizeInMB} MB):`, error.message);
      throw error;
    }
  }
}
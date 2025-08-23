import { Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { NatsModule } from '../nats/nats.module';

@Module({
  imports: [NatsModule],
  controllers: [WebhooksController]
})
export class WebhooksModule {}
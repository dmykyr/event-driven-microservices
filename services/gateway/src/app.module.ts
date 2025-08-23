import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NatsModule } from './nats/nats.module';
import { HealthModule } from './health/health.module';
import { WebhooksModule } from './webhook/webhooks.module';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      NatsModule,
      HealthModule,
      WebhooksModule,
  ],
})
export class AppModule {}

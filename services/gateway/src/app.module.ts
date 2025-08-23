import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NatsModule } from './nats/nats.module';
import { HealthModule } from './health/health.module';
import { WebhooksModule } from './webhook/webhooks.module';
import { LoggerModule } from '@event-driven-microservices/logger';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      LoggerModule.forRoot({
        serviceName: 'gateway',
      }),
      NatsModule,
      HealthModule,
      WebhooksModule,
  ],
})
export class AppModule {}

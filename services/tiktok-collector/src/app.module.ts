import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { EventCollectorModule } from './eventCollector/eventCollector.module';
import { TiktokEventModule } from './tiktokEvent/tiktokEvent.module';
import { LoggerModule } from '@event-driven-microservices/logger';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      serviceName: 'tiktok collector',
    }),
    DatabaseModule,
    HealthModule,
    TiktokEventModule,
    EventCollectorModule,
  ],
})
export class AppModule {}

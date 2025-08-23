import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { FacebookEventModule } from './facebookEvent/facebookEvent.module';
import { EventCollectorModule } from './eventCollector/eventCollector.module';
import { LoggerModule } from '@event-driven-microservices/logger';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.forRoot({
      serviceName: 'facebook collector',
    }),
    DatabaseModule,
    HealthModule,
    FacebookEventModule,
    EventCollectorModule,
  ],
})
export class AppModule {}

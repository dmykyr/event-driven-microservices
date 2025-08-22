import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { FacebookEventModule } from './facebookEvent/facebookEvent.module';
import { EventCollectorModule } from './eventCollector/eventCollector.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    FacebookEventModule,
    EventCollectorModule,
  ],
})
export class AppModule {}

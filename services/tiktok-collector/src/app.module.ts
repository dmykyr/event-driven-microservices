import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { EventCollectorModule } from './eventCollector/eventCollector.module';
import { TiktokEventModule } from './tiktokEvent/tiktokEvent.module';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    TiktokEventModule,
    EventCollectorModule,
  ],
})
export class AppModule {}

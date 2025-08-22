import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { EventCollectorService } from './eventCollector.service';
import { HealthModule } from './health/health.module';
import { FacebookEventModule } from './facebook-event/facebookEvent.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    FacebookEventModule
  ],
  providers: [EventCollectorService],
})
export class AppModule {}

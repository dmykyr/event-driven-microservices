import { Module } from '@nestjs/common';
import { EventCollectorService } from './eventCollector.service';
import { NatsModule } from '../nats/nats.module';
import { TiktokEventModule } from '../tiktokEvent/tiktokEvent.module';

@Module({
  imports: [NatsModule, TiktokEventModule],
  providers: [EventCollectorService],
  exports: [EventCollectorService]
})
export class EventCollectorModule {}
import { Module } from '@nestjs/common';
import { EventCollectorService } from './eventCollector.service';
import { NatsModule } from '../nats/nats.module';
import { FacebookEventModule } from '../facebookEvent/facebookEvent.module';

@Module({
  imports: [NatsModule, FacebookEventModule],
  providers: [EventCollectorService],
  exports: [EventCollectorService]
})
export class EventCollectorModule {}
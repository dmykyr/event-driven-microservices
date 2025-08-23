import { Injectable, OnModuleInit } from '@nestjs/common';
import { TiktokEventService } from '../tiktokEvent/tiktokEvent.service';
import { NatsService } from '../nats/nats.service';
import { TiktokEventDto } from '@event-driven-microservices/types';

@Injectable()
export class EventCollectorService implements OnModuleInit {

  constructor(
      private readonly tiktokEventService: TiktokEventService,
      private readonly natsService: NatsService,
  ) {}

  async onModuleInit() {
    await this.natsService.subscribeTiktokEvents(
        this.handleTiktokEvent.bind(this)
    );
  }

  async handleTiktokEvent(event: TiktokEventDto) {
    try {
      const createdEvent = await this.tiktokEventService.createEvent(event);
      console.log('created tiktok event:', createdEvent.id);

    } catch (error) {
      throw error;
    }
  }
}

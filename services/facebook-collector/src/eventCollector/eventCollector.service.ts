import { Injectable, OnModuleInit } from '@nestjs/common';
import { FacebookEventService } from '../facebookEvent/facebookEvent.service';
import { NatsService } from '../nats/nats.service';
import { FacebookEventDto } from '@event-driven-microservices/types';

@Injectable()
export class EventCollectorService implements OnModuleInit {

  constructor(
      private readonly fbEventService: FacebookEventService,
      private readonly natsService: NatsService,
  ) {}

  async onModuleInit() {
    await this.natsService.subscribeFacebookEvents(
        this.handleFacebookEvent.bind(this)
    );
  }

  async handleFacebookEvent(event: FacebookEventDto) {
    try {
      const createdEvent = await this.fbEventService.createEvent(event);
      console.log('created event:', createdEvent.id);

    } catch (error) {
      throw error;
    }
  }
}

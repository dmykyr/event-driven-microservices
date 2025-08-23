import { Injectable, OnModuleInit } from '@nestjs/common';
import { FacebookEventService } from '../facebookEvent/facebookEvent.service';
import { NatsService } from '../nats/nats.service';
import { FacebookEventDto } from '@event-driven-microservices/types';
import { WinstonLoggerService } from '@event-driven-microservices/logger';

@Injectable()
export class EventCollectorService implements OnModuleInit {

  constructor(
      private readonly fbEventService: FacebookEventService,
      private readonly natsService: NatsService,
      private readonly logger: WinstonLoggerService
  ) {}

  async onModuleInit() {
    await this.natsService.subscribeFacebookEvents(
        this.handleFacebookEvent.bind(this)
    );
  }

  async handleFacebookEvent(event: FacebookEventDto) {
    try {
      const createdEvent = await this.fbEventService.createEvent(event);
      this.logger.log('created event:', createdEvent.id);

    } catch (error) {
      throw error;
    }
  }
}

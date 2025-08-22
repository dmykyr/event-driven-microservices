import { DatabaseService } from './database/database.service';
import { FacebookEvent } from '@event-driven-microservices/database';

export class EventCollectorService {
  constructor (
      private readonly databaseService: DatabaseService,
  ) {}
  async handleFacebookEvent(event: FacebookEvent) {
    const createdEvent = await this.databaseService.createEvent(event);
    console.log('created event:',createdEvent)
  }
}
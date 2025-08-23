import { DatabaseService } from '../database/database.service';
import { FacebookEventMapper } from './facebookEvent.mapper';
import { FacebookEvent } from '@event-driven-microservices/database';
import { Injectable } from '@nestjs/common';
import { FacebookEventDto } from '@event-driven-microservices/types';

@Injectable()
export class FacebookEventService {
  constructor (
      private readonly databaseService: DatabaseService,
  ) {}

  async createEvent (event: FacebookEventDto): Promise<FacebookEvent> {
    const dbEvent = FacebookEventMapper.toEntity(event);
    return await this.databaseService.createEvent(dbEvent);
  }
}
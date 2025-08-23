import { DatabaseService } from '../database/database.service';
import { TiktokEventMapper } from './tiktokEvent.mapper';
import { TiktokEvent } from '@event-driven-microservices/database';
import { Injectable } from '@nestjs/common';
import { TiktokEventDto } from '@event-driven-microservices/types';

@Injectable()
export class TiktokEventService {
  constructor (
      private readonly databaseService: DatabaseService,
  ) {}

  async createEvent (event: TiktokEventDto): Promise<TiktokEvent> {
    const dbEvent = TiktokEventMapper.toEntity(event);
    return await this.databaseService.createEvent(dbEvent);
  }
}
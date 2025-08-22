import { Module } from '@nestjs/common';
import { FacebookEventService } from './facebookEvent.service';
import { DatabaseModule } from '../database/database.module';
import { FacebookEventController } from './facebookEvent.controller';

@Module({
  imports: [DatabaseModule],
  providers: [FacebookEventService],
  controllers: [FacebookEventController],
  exports: [FacebookEventService]
})
export class FacebookEventModule {}
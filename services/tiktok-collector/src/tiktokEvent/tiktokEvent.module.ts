import { Module } from '@nestjs/common';
import { TiktokEventService } from './tiktokEvent.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [TiktokEventService],
  exports: [TiktokEventService]
})
export class TiktokEventModule {}
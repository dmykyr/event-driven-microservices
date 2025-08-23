import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { TiktokEvent, PrismaClient } from '@event-driven-microservices/database';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async createEvent(event: TiktokEvent): Promise<TiktokEvent> {
    const tiktokEventRepository = this.tiktokEvent;
    return await tiktokEventRepository.create({data: event});
  }
}
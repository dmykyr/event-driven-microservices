import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { FacebookEvent, PrismaClient } from '@event-driven-microservices/database';

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

  async createEvent(event: FacebookEvent): Promise<FacebookEvent> {
    const facebookEventRepository = this.facebookEvent;
    return await facebookEventRepository.create({data: event});
  }
}
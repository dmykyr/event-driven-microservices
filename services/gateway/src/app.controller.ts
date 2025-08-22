import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { NatsService } from './nats/nats.service';

@Controller()
export class AppController {
  constructor(
      private readonly appService: AppService,
      private readonly natsService: NatsService,
  ) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Post('webhooks')
  async handleWebhook (@Body() body: any) {
    try {
      await this.natsService.publishFacebookEvent(body);
    } catch (error) {
      throw error;
    }

    return {
      success: true,
      message: 'Webhook received',
      timestamp: new Date().toISOString()
    };
  }
}

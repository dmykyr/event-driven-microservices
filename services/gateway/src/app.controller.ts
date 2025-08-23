import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { NatsService } from './nats/nats.service';
import { ZodValidationPipe } from './pipes/zodValidation.pipe';
import { EventsDtoSchema, EventsDto } from '@event-driven-microservices/types'

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
  @UsePipes(new ZodValidationPipe(EventsDtoSchema))
  async handleWebhook (@Body() body: EventsDto) {
    try {
      for (const event of body) {
        if (event.source === 'facebook') {
          await this.natsService.publishFacebookEvent(event);
        }
      }
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

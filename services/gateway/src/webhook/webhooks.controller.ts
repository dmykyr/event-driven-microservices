import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AppService } from '../app.service';
import { NatsService } from '../nats/nats.service';
import { ZodValidationPipe } from '../pipes/zodValidation.pipe';
import { EventsDtoSchema, EventsDto } from '@event-driven-microservices/types'

@Controller('webhooks')
export class WebhooksController {
  constructor(
      private readonly appService: AppService,
      private readonly natsService: NatsService,
  ) {}

  @Post()
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

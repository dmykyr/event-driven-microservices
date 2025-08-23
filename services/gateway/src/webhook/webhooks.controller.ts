import { Body, Controller, HttpException, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { NatsService } from '../nats/nats.service';
import { ZodValidationPipe } from '../pipes/zodValidation.pipe';
import { EventsDtoSchema, EventsDto } from '@event-driven-microservices/types'

@Controller('webhooks')
export class WebhooksController {
  constructor(
      private readonly natsService: NatsService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(EventsDtoSchema))
  async handleWebhook (@Body() body: EventsDto) {
    if (this.natsService.isShutdownInProgress()) {
      throw new HttpException(
          'Service is unavailable',
          HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    try {
      const publishPromises = [];

      for (const event of body) {
        if (event.source === 'facebook') {
          publishPromises.push(this.natsService.publishFacebookEvent(event));
        } else if (event.source === 'tiktok') {
          publishPromises.push(this.natsService.publishTiktokEvent(event));
        }
      }

      await Promise.all(publishPromises);

    } catch (error) {
      if (error.message?.includes('shutting down')) {
        throw new HttpException(
            'Service is unavailable',
            HttpStatus.SERVICE_UNAVAILABLE
        );
      }
      throw error;
    }

    return {
      success: true,
      message: 'Webhook received',
      timestamp: new Date().toISOString()
    };
  }
}

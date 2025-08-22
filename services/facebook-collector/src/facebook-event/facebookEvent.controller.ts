import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { FacebookEventService } from './facebookEvent.service';
import { FacebookEvent } from '@event-driven-microservices/database';
import { ZodValidationPipe } from '../pipes/zodValidation.pipe';
import { FacebookEventDto, FacebookEventDtoSchema } from '../dto/facebookEvent.dto';

@Controller('facebook')
export class FacebookEventController {
  constructor (
    private readonly facebookEventService: FacebookEventService,
  ) {}
  @Post()
  @UsePipes(new ZodValidationPipe(FacebookEventDtoSchema))
  async createEvent(@Body() eventDto: FacebookEventDto): Promise<FacebookEvent> {
    return this.facebookEventService.createEvent(eventDto)
  }
}
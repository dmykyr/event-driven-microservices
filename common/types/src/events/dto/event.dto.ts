import { z } from 'zod'
import { EventDtoSchema, EventsDtoSchema } from '../schemas/event.schema';

export type EventDto = z.infer<typeof EventDtoSchema>;
export type EventsDto = z.infer<typeof EventsDtoSchema>;
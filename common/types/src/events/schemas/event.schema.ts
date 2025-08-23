import { z } from 'zod'
import { TiktokEventDtoSchema } from './tiktokEvent.schema';
import { FacebookEventDtoSchema } from './facebookEvent.schema';

export const EventDtoSchema = z.union([FacebookEventDtoSchema, TiktokEventDtoSchema]);
export const EventsDtoSchema = z.array(EventDtoSchema);

export type EventSchema = z.infer<typeof EventDtoSchema>;
export type EventsDto = z.infer<typeof EventsDtoSchema>;
import z from 'zod'
import {
  TiktokEngagementTopSchema,
  TiktokEngagementBottomSchema,
  TiktokEventDtoSchema,
  TiktokEventTypeSchema,
  TiktokDeviceSchema,
} from '../schemas/tiktokEvent.schema';

export type TiktokEventTypeDto = z.infer<typeof TiktokEventTypeSchema>;
export type TiktokEventDto = z.infer<typeof TiktokEventDtoSchema>;
export type TiktokEngagementTopDto = z.infer<typeof TiktokEngagementTopSchema>;
export type TiktokEngagementBottomDto = z.infer<typeof TiktokEngagementBottomSchema>;
export type TiktokDeviceDto = z.infer<typeof TiktokDeviceSchema>;
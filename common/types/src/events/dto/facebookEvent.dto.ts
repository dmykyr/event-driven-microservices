import z from 'zod'
import {
  FacebookEngagementBottomSchema,
  FacebookEngagementTopSchema,
  FacebookEventDtoSchema,
  FacebookEventTypeSchema,
  FunnelStageSchema,
  BrowserSchema,
  ClickPositionSchema,
  GenderSchema,
  ReferrerSchema,
} from '../schemas/facebookEvent.schema';

export type FacebookEventTypeDto = z.infer<typeof FacebookEventTypeSchema>;
export type FacebookEventDto = z.infer<typeof FacebookEventDtoSchema>;
export type FunnelStageDto = z.infer<typeof FunnelStageSchema>;
export type FacebookEngagementTopDto = z.infer<typeof FacebookEngagementTopSchema>;
export type FacebookEngagementBottom = z.infer<typeof FacebookEngagementBottomSchema>;
export type BrowserDto = z.infer<typeof BrowserSchema>;
export type ClickPositionDto = z.infer<typeof ClickPositionSchema>;
export type GenderDto = z.infer<typeof GenderSchema>;
export type ReferrerDto = z.infer<typeof ReferrerSchema>;
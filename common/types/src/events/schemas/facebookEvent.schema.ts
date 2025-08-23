import z from 'zod'
export const FacebookTopEventTypeSchema = z.enum([
  'ad.view',
  'page.like',
  'comment',
  'video.view'
]);

export const FacebookBottomEventTypeSchema = z.enum([
  'ad.click',
  'form.submission',
  'checkout.complete'
]);

export const FacebookEventTypeSchema = z.union([
  FacebookTopEventTypeSchema,
  FacebookBottomEventTypeSchema
]);

export const GenderSchema = z.enum(['male', 'female', 'non-binary']);

export const FacebookUserLocationSchema = z.object({
  country: z.string().min(1, 'country is required'),
  city: z.string().min(1, 'city is required')
});

export const FacebookUserSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  name: z.string().min(1, 'name is required'),
  age: z.number().int().min(5, 'age must be at least 5'),
  gender: GenderSchema,
  location: FacebookUserLocationSchema
});

export const ReferrerSchema = z.enum(['newsfeed', 'marketplace', 'groups']);
export const ClickPositionSchema = z.enum(['top_left', 'bottom_right', 'center']);
export const DeviceSchema = z.enum(['mobile', 'desktop']);
export const BrowserSchema = z.enum(['Chrome', 'Firefox', 'Safari']);

export const FacebookEngagementTopSchema = z.object({
  actionTime: z.string().datetime('wrong datetime format'),
  referrer: ReferrerSchema,
  videoId: z.string().nullable()
});

export const FacebookEngagementBottomSchema = z.object({
  adId: z.string().min(1, 'adId is required'),
  campaignId: z.string().min(1, 'campaignId ID is required'),
  clickPosition: ClickPositionSchema,
  device: DeviceSchema,
  browser: BrowserSchema,
  purchaseAmount: z.string().nullable().refine(
      (val) => val === null || !isNaN(parseFloat(val)),
      'purchase amount must be a valid number'
  )
});

export const FunnelStageSchema = z.enum(['top', 'bottom']);

export const FacebookEventDtoSchema = z.discriminatedUnion('funnelStage', [
  z.object({
    eventId: z.string().min(1, 'eventId is required'),
    timestamp: z.iso.datetime('wrong timestamp format'),
    source: z.literal('facebook'),
    funnelStage: z.literal('top'),
    eventType: FacebookTopEventTypeSchema,
    data: z.object({
      user: FacebookUserSchema,
      engagement: FacebookEngagementTopSchema
    })
  }),
  z.object({
    eventId: z.string().min(1, 'eventId is required'),
    timestamp: z.iso.datetime('wrong timestamp format'),
    source: z.literal('facebook'),
    funnelStage: z.literal('bottom'),
    eventType: FacebookBottomEventTypeSchema,
    data: z.object({
      user: FacebookUserSchema,
      engagement: FacebookEngagementBottomSchema
    })
  })
]);


export type FacebookEventTypeDto = z.infer<typeof FacebookEventTypeSchema>;
export type FacebookEventSchema = z.infer<typeof FacebookEventDtoSchema>;
export type FunnelStageDto = z.infer<typeof FunnelStageSchema>;
export type FacebookEngagementTopDto = z.infer<typeof FacebookEngagementTopSchema>;
export type FacebookEngagementBottom = z.infer<typeof FacebookEngagementBottomSchema>;
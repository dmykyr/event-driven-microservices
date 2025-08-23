import { z } from 'zod'

export const TiktokTopEventTypeSchema = z.enum([
  'video.view',
  'like',
  'share',
  'comment'
]);

export const TiktokBottomEventTypeSchema = z.enum([
  'profile.visit',
  'purchase',
  'follow'
]);

export const TiktokEventTypeSchema = z.union([
  TiktokTopEventTypeSchema,
  TiktokBottomEventTypeSchema
]);

export const TiktokUserSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
  username: z.string().min(1, 'username is required'),
  followers: z.number().int().min(0, 'followers must be non-negative')
});

export const TiktokDeviceSchema = z.enum(['Android', 'iOS', 'Desktop']);

export const TiktokEngagementTopSchema = z.object({
  watchTime: z.number().min(0, 'watchTime must be non-negative'),
  percentageWatched: z.number().min(0).max(100, 'percentageWatched must be between 0 and 100'),
  device: TiktokDeviceSchema,
  country: z.string().min(1, 'country is required'),
  videoId: z.string().min(1, 'videoId is required')
});

export const TiktokEngagementBottomSchema = z.object({
  actionTime: z.iso.datetime('wrong datetime format'),
  profileId: z.string().nullable(),
  purchasedItem: z.string().nullable(),
  purchaseAmount: z.string().nullable().refine(
      (val) => val === null || !isNaN(parseFloat(val)),
      'purchase amount must be a valid number'
  )
});

export const TiktokEventDtoSchema = z.discriminatedUnion('funnelStage', [
  z.object({
    eventId: z.string().min(1, 'eventId is required'),
    timestamp: z.iso.datetime('wrong timestamp format'),
    source: z.literal('tiktok'),
    funnelStage: z.literal('top'),
    eventType: TiktokTopEventTypeSchema,
    data: z.object({
      user: TiktokUserSchema,
      engagement: TiktokEngagementTopSchema
    })
  }),
  z.object({
    eventId: z.string().min(1, 'eventId is required'),
    timestamp: z.iso.datetime('wrong timestamp format'),
    source: z.literal('tiktok'),
    funnelStage: z.literal('bottom'),
    eventType: TiktokBottomEventTypeSchema,
    data: z.object({
      user: TiktokUserSchema,
      engagement: TiktokEngagementBottomSchema
    })
  })
]);
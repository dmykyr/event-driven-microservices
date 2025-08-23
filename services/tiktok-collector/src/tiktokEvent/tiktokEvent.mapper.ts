import { TiktokEvent, TiktokEventType, TiktokDevice, Prisma } from '@event-driven-microservices/database';
import {
  TiktokEngagementBottomDto,
  TiktokEngagementTopDto,
  TiktokEventDto,
  TiktokEventTypeDto,
  FunnelStageDto,
  TiktokDeviceDto,
} from '@event-driven-microservices/types';

export class TiktokEventMapper {
  static toEntity(event: TiktokEventDto): TiktokEvent {
    return {
      id: event.eventId,
      timestamp: new Date(event.timestamp),
      funnelStage: event.funnelStage,
      eventType: TiktokEventMapper.mapEventType(event.eventType),

      userId: event.data.user.userId,
      username: event.data.user.username,
      followers: event.data.user.followers,

      ...TiktokEventMapper.getEngagementData(event.data.engagement, event.funnelStage),
    }
  }

  private static mapEventType(eventType: TiktokEventTypeDto): TiktokEventType {
    const eventTypeMap: Record<TiktokEventTypeDto, TiktokEventType> = {
      'video.view': 'videoView',
      'like': 'like',
      'share': 'share',
      'comment': 'comment',
      'profile.visit': 'profileVisit',
      'purchase': 'purchase',
      'follow': 'follow'
    };

    return eventTypeMap[eventType];
  }

  private static mapDevice(device: TiktokDeviceDto): TiktokDevice {
    const deviceMap: Record<TiktokDeviceDto, TiktokDevice> = {
      'Android': 'android',
      'iOS': 'ios',
      'Desktop': 'desktop'
    };

    return deviceMap[device];
  }

  private static getEngagementData(engagement: TiktokEngagementTopDto | TiktokEngagementBottomDto, funnelStage: FunnelStageDto) {
    if (funnelStage === 'top') {
      const topEngagement = engagement as TiktokEngagementTopDto;
      return {
        watchTime: topEngagement.watchTime,
        percentageWatched: topEngagement.percentageWatched,
        device: TiktokEventMapper.mapDevice(topEngagement.device),
        country: topEngagement.country,
        videoId: topEngagement.videoId,
        actionTime: null,
        profileId: null,
        purchasedItem: null,
        purchaseAmount: null,
      };
    } else {
      const bottomEngagement = engagement as TiktokEngagementBottomDto;
      return {
        watchTime: null,
        percentageWatched: null,
        device: null,
        country: null,
        videoId: null,
        actionTime: new Date(bottomEngagement.actionTime),
        profileId: bottomEngagement.profileId,
        purchasedItem: bottomEngagement.purchasedItem,
        purchaseAmount: bottomEngagement.purchaseAmount ? new Prisma.Decimal(bottomEngagement.purchaseAmount) : null,
      };
    }
  }
}
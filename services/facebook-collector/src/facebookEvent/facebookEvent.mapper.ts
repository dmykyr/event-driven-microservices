import { FacebookEvent, FacebookEventType, Gender, ClickPosition, Browser } from '@event-driven-microservices/database';
import { Prisma } from '@event-driven-microservices/database';
import {
  FacebookEngagementBottom,
  FacebookEngagementTopDto,
  FacebookEventDto,
  FacebookEventTypeDto,
  FunnelStageDto,
  BrowserDto,
  GenderDto,
  ClickPositionDto,
} from '@event-driven-microservices/types';

export class FacebookEventMapper {
  static toEntity(event: FacebookEventDto): FacebookEvent {
    return {
      id: event.eventId,
      timestamp: new Date(event.timestamp),
      funnelStage: event.funnelStage,
      eventType: FacebookEventMapper.mapEventType(event.eventType),

      userId: event.data.user.userId,
      userName: event.data.user.name,
      userAge: event.data.user.age,
      userGender: FacebookEventMapper.mapGender(event.data.user.gender),
      userCountry: event.data.user.location.country,
      userCity: event.data.user.location.city,

      ...FacebookEventMapper.getEngagementData(event.data.engagement, event.funnelStage),
    }
  }

  private static mapEventType(eventType: FacebookEventTypeDto): FacebookEventType {
    const eventTypeMap: Record<FacebookEventTypeDto, FacebookEventType> = {
      'ad.view': 'adView',
      'page.like': 'pageLike',
      'comment': 'comment',
      'video.view': 'videoView',
      'ad.click': 'adClick',
      'form.submission': 'formSubmission',
      'checkout.complete': 'checkoutComplete'
    };

    return eventTypeMap[eventType];
  }

  private static mapGender(gender: GenderDto): Gender {
    const genderMap: Record<GenderDto, Gender> = {
      'male': 'male',
      'female': 'female',
      'non-binary': 'nonBinary'
    };

    return genderMap[gender];
  }

  private static mapClickPosition(position: ClickPositionDto): ClickPosition {
    const positionMap: Record<ClickPositionDto, ClickPosition> = {
      'top_left': 'topLeft',
      'bottom_right': 'bottomRight',
      'center': 'center'
    };

    return positionMap[position];
  }

  private static mapBrowser(browser: BrowserDto): Browser {
    const browserMap: Record<BrowserDto, Browser> = {
      'Chrome': 'chrome',
      'Firefox': 'firefox',
      'Safari': 'safari'
    };

    return browserMap[browser];
  }

  private static getEngagementData(engagement: FacebookEngagementTopDto | FacebookEngagementBottom, funnelStage: FunnelStageDto) {
    if (funnelStage === 'top') {
      const topEngagement = engagement as FacebookEngagementTopDto;
      return {
        actionTime: new Date(topEngagement.actionTime),
        referrer: topEngagement.referrer,
        videoId: topEngagement.videoId,
        adId: null,
        campaignId: null,
        clickPosition: null,
        device: null,
        browser: null,
        purchaseAmount: null,
      };
    } else {
      const bottomEngagement = engagement as FacebookEngagementBottom;
      return {
        actionTime: null,
        referrer: null,
        videoId: null,
        adId: bottomEngagement.adId,
        campaignId: bottomEngagement.campaignId,
        clickPosition: FacebookEventMapper.mapClickPosition(bottomEngagement.clickPosition),
        device: bottomEngagement.device,
        browser: FacebookEventMapper.mapBrowser(bottomEngagement.browser),
        purchaseAmount: bottomEngagement.purchaseAmount ? new Prisma.Decimal(bottomEngagement.purchaseAmount) : null,
      };
    }
  }
}
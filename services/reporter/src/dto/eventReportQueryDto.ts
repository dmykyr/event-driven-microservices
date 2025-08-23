import { BaseReportQueryDto } from './baseReportQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum FunnelStageFilter {
  TOP = 'top',
  BOTTOM = 'bottom',
}

export enum EventTypeFilter {
  AD_VIEW = 'ad.view',
  PAGE_LIKE = 'page.like',
  COMMENT = 'comment',
  VIDEO_VIEW = 'video.view',
  AD_CLICK = 'ad.click',
  FORM_SUBMISSION = 'form.submission',
  CHECKOUT_COMPLETE = 'checkout.complete',

  LIKE = 'like',
  SHARE = 'share',
  PROFILE_VISIT = 'profile.visit',
  PURCHASE = 'purchase',
  FOLLOW = 'follow',
}

export class EventReportQueryDto extends BaseReportQueryDto {
  @ApiPropertyOptional({ enum: FunnelStageFilter, description: 'Funnel stage filter' })
  @IsOptional()
  @IsEnum(FunnelStageFilter)
  funnelStage?: FunnelStageFilter;

  @ApiPropertyOptional({
    enum: EventTypeFilter,
  })
  @IsOptional()
  @IsEnum(EventTypeFilter)
  eventType?: EventTypeFilter;
}
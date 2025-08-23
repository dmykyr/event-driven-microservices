import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@event-driven-microservices/database';
import { BaseReportQueryDto, ReportSource } from '../dto/baseReportQuery.dto';
import { EventReportQueryDto, EventTypeFilter } from '../dto/eventReportQueryDto';
import { RevenueReportQueryDto } from '../dto/revenueReportQueryDto';
import { RevenueReport } from '../responses/revenueReport.response';
import { FacebookDemographicsResponse } from '../responses/facebookDemographics.response';
import { TiktokDemographicsResponse } from '../responses/tiktokDemographics.response';
import { EventReport } from '../responses/eventReport.response';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async getEventsReport(query: EventReportQueryDto): Promise<EventReport[]> {
    const whereCondition = this.buildDateRangeCondition(query);

    if (query.funnelStage) {
      whereCondition.funnelStage = query.funnelStage;
    }

    const results = [];

    if (!query.source || query.source === ReportSource.FACEBOOK) {
      if (query.eventType && this.isFacebookEventType(query.eventType)) {
        const mappedEventType = this.mapToFacebookEventType(query.eventType as EventTypeFilter);

        const facebookEvents = await this.facebookEvent.groupBy({
          by: ['eventType', 'funnelStage'],
          where: {
            ...whereCondition,
            eventType: mappedEventType,
          },
          _count: {
            id: true,
          },
        });

        results.push(
            ...facebookEvents.map((event) => ({
              eventType: event.eventType,
              count: event._count.id,
              source: 'facebook',
              funnelStage: event.funnelStage,
            }))
        );
      }
    }

    if (!query.source || query.source === ReportSource.TIKTOK) {
      if (query.eventType && this.isTiktokEventType(query.eventType)) {
        // Map the DTO event type to Prisma enum
        const mappedEventType = this.mapToTiktokEventType(query.eventType as EventTypeFilter);

        const tiktokEvents = await this.tiktokEvent.groupBy({
          by: ['eventType', 'funnelStage'],
          where: {
            ...whereCondition,
            eventType: mappedEventType,
          },
          _count: {
            id: true,
          },
        });

        results.push(
            ...tiktokEvents.map((event) => ({
              eventType: event.eventType,
              count: event._count.id,
              source: 'tiktok',
              funnelStage: event.funnelStage,
            }))
        );
      }
    }

    return results;
  }

  async getRevenueReport(query: RevenueReportQueryDto): Promise<RevenueReport[]> {
    const whereCondition = this.buildDateRangeCondition(query);
    const results: RevenueReport[] = [];

    if (!query.source || query.source === ReportSource.FACEBOOK) {
      const facebookWhere = {
        ...whereCondition,
        eventType: 'checkoutComplete',
        purchaseAmount: { not: null },
      };

      if (query.campaignId) {
        facebookWhere.campaignId = query.campaignId;
      }

      const facebookRevenue = await this.facebookEvent.aggregate({
        where: facebookWhere,
        _sum: {
          purchaseAmount: true,
        },
        _count: {
          id: true,
        },
        _avg: {
          purchaseAmount: true,
        },
      });

      if (facebookRevenue._count.id > 0) {
        results.push({
          source: 'facebook',
          totalRevenue: Number(facebookRevenue._sum.purchaseAmount || 0),
          transactionCount: facebookRevenue._count.id,
          averageOrderValue: Number(facebookRevenue._avg.purchaseAmount || 0),
          campaignId: query.campaignId,
        });
      }
    }

    if (!query.source || query.source === ReportSource.TIKTOK) {
      const tiktokWhere = {
        ...whereCondition,
        eventType: 'purchase',
        purchaseAmount: { not: null },
      };

      const tiktokRevenue = await this.tiktokEvent.aggregate({
        where: tiktokWhere,
        _sum: {
          purchaseAmount: true,
        },
        _count: {
          id: true,
        },
        _avg: {
          purchaseAmount: true,
        },
      });

      if (tiktokRevenue._count.id > 0) {
        results.push({
          source: 'tiktok',
          totalRevenue: Number(tiktokRevenue._sum.purchaseAmount || 0),
          transactionCount: tiktokRevenue._count.id,
          averageOrderValue: Number(tiktokRevenue._avg.purchaseAmount || 0),
        });
      }
    }

    return results;
  }

  async getFacebookDemographics(query: BaseReportQueryDto): Promise<FacebookDemographicsResponse> {
    const whereCondition = this.buildDateRangeCondition(query);

    const [ageStats, genderStats, countryStats, cityStats] = await Promise.all([
      this.facebookEvent.aggregate({
        where: whereCondition,
        _avg: { userAge: true },
      }),

      this.facebookEvent.groupBy({
        by: ['userGender'],
        where: whereCondition,
        _count: { id: true },
      }),

      this.facebookEvent.groupBy({
        by: ['userCountry'],
        where: whereCondition,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      this.facebookEvent.groupBy({
        by: ['userCity', 'userCountry'],
        where: whereCondition,
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),
    ]);

    const totalEvents = genderStats.reduce((sum, g) => sum + g._count.id, 0);

    return {
      source: 'facebook' as const,
      averageAge: Number(ageStats._avg.userAge || 0),
      genderDistribution: {
        male: genderStats.find(g => g.userGender === 'male')?._count.id || 0,
        female: genderStats.find(g => g.userGender === 'female')?._count.id || 0,
        nonBinary: genderStats.find(g => g.userGender === 'nonBinary')?._count.id || 0,
      },
      topCountries: countryStats.map(c => ({
        country: c.userCountry,
        count: c._count.id,
        percentage: totalEvents > 0 ? (c._count.id / totalEvents) * 100 : 0,
      })),
      topCities: cityStats.map(c => ({
        city: c.userCity,
        country: c.userCountry,
        count: c._count.id,
        percentage: totalEvents > 0 ? (c._count.id / totalEvents) * 100 : 0,
      })),
    };
  }

  async getTiktokDemographics(query: BaseReportQueryDto): Promise<TiktokDemographicsResponse> {
    const whereCondition = this.buildDateRangeCondition(query);

    const [followerStats, watchTimeStats, countryStats, allFollowerData] = await Promise.all([
      this.tiktokEvent.aggregate({
        where: whereCondition,
        _avg: { followers: true },
      }),

      this.tiktokEvent.aggregate({
        where: {
          ...whereCondition,
          watchTime: { not: null },
          percentageWatched: { not: null },
        },
        _avg: {
          watchTime: true,
          percentageWatched: true,
        },
      }),

      this.tiktokEvent.groupBy({
        by: ['country'],
        where: {
          ...whereCondition,
          country: { not: null },
        },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 10,
      }),

      this.tiktokEvent.findMany({
        where: whereCondition,
        select: { followers: true },
      }),
    ]);

    const followerRanges = this.calculateFollowerRanges(allFollowerData.map(item => item.followers));

    const totalEvents = countryStats.reduce((sum, country) => sum + country._count.id, 0);
    const totalFollowerEvents = followerRanges.reduce((sum, range) => sum + range.count, 0);

    return {
      source: 'tiktok' as const,
      averageFollowers: Number(followerStats._avg.followers || 0),
      followerRanges: followerRanges.map((range) => ({
        range: range.range,
        count: range.count,
        percentage: totalFollowerEvents > 0 ? (range.count / totalFollowerEvents) * 100 : 0,
      })),
      topCountries: countryStats.map((country) => ({
        country: country.country || 'Unknown',
        count: country._count.id,
        percentage: totalEvents > 0 ? (country._count.id / totalEvents) * 100 : 0,
      })),
      averageWatchTime: Number(watchTimeStats._avg.watchTime || 0),
      averagePercentageWatched: Number(watchTimeStats._avg.percentageWatched || 0),
    };
  }

  private calculateFollowerRanges(followers: number[]) {
    const ranges = {
      '0-1K': 0,
      '1K-10K': 0,
      '10K-100K': 0,
      '100K-1M': 0,
      '1M+': 0,
    };

    followers.forEach(count => {
      if (count < 1000) {
        ranges['0-1K']++;
      } else if (count < 10000) {
        ranges['1K-10K']++;
      } else if (count < 100000) {
        ranges['10K-100K']++;
      } else if (count < 1000000) {
        ranges['100K-1M']++;
      } else {
        ranges['1M+']++;
      }
    });

    return Object.entries(ranges).map(([range, count]) => ({
      range,
      count,
    }));
  }

  private buildDateRangeCondition(query: BaseReportQueryDto) {
    const condition: any = {};

    if (query.from || query.to) {
      condition.timestamp = {};

      if (query.from) {
        condition.timestamp.gte = new Date(query.from);
      }

      if (query.to) {
        condition.timestamp.lte = new Date(query.to);
      }
    }

    return condition;
  }

  private isFacebookEventType(eventType: string): boolean {
    const facebookEventTypes = [
      EventTypeFilter.AD_VIEW,
      EventTypeFilter.PAGE_LIKE,
      EventTypeFilter.COMMENT,
      EventTypeFilter.VIDEO_VIEW,
      EventTypeFilter.AD_CLICK,
      EventTypeFilter.FORM_SUBMISSION,
      EventTypeFilter.CHECKOUT_COMPLETE,
    ];
    return facebookEventTypes.includes(eventType as any);
  }

  private isTiktokEventType(eventType: string): boolean {
    const tiktokEventTypes = [
      EventTypeFilter.VIDEO_VIEW,
      EventTypeFilter.LIKE,
      EventTypeFilter.SHARE,
      EventTypeFilter.COMMENT,
      EventTypeFilter.PROFILE_VISIT,
      EventTypeFilter.PURCHASE,
      EventTypeFilter.FOLLOW,
    ];
    return tiktokEventTypes.includes(eventType as any);
  }

  private mapToFacebookEventType(eventType: EventTypeFilter): any {
    const mapping = {
      [EventTypeFilter.AD_VIEW]: 'adView',
      [EventTypeFilter.PAGE_LIKE]: 'pageLike',
      [EventTypeFilter.COMMENT]: 'comment',
      [EventTypeFilter.VIDEO_VIEW]: 'videoView',
      [EventTypeFilter.AD_CLICK]: 'adClick',
      [EventTypeFilter.FORM_SUBMISSION]: 'formSubmission',
      [EventTypeFilter.CHECKOUT_COMPLETE]: 'checkoutComplete',
    };
    return mapping[eventType];
  }

  private mapToTiktokEventType(eventType: EventTypeFilter): any {
    const mapping = {
      [EventTypeFilter.VIDEO_VIEW]: 'videoView',
      [EventTypeFilter.LIKE]: 'like',
      [EventTypeFilter.SHARE]: 'share',
      [EventTypeFilter.COMMENT]: 'comment',
      [EventTypeFilter.PROFILE_VISIT]: 'profileVisit',
      [EventTypeFilter.PURCHASE]: 'purchase',
      [EventTypeFilter.FOLLOW]: 'follow',
    };
    return mapping[eventType];
  }
}
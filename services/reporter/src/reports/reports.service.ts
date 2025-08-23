import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { EventReportQueryDto } from '../dto/eventReportQueryDto';
import { RevenueReportQueryDto } from '../dto/revenueReportQueryDto';
import { BaseReportQueryDto, ReportSource } from '../dto/baseReportQuery.dto';
import { DemographicsReportResponse } from '../responses/demographicsReportResponse';
import { RevenueReportResponse } from '../responses/revenueReport.response';
import { EventReportResponse } from '../responses/eventReport.response';
import { FacebookDemographicsResponse } from '../responses/facebookDemographics.response';
import { TiktokDemographicsResponse } from '../responses/tiktokDemographics.response';

@Injectable()
export class ReportsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getEventReport(query: EventReportQueryDto): Promise<EventReportResponse> {
    const events = await this.databaseService.getEventsReport(query);
    const totalEvents = events.reduce((sum, event) => sum + event.count, 0);

    const dateRange = this.getDateRange(query);

    return {
      events,
      totalEvents,
      dateRange,
    };
  }

  async getRevenueReport(query: RevenueReportQueryDto): Promise<RevenueReportResponse> {
    const revenue = await this.databaseService.getRevenueReport(query);

    const totalRevenue = revenue.reduce((sum, report) => sum + report.totalRevenue, 0);
    const totalTransactions = revenue.reduce((sum, report) => sum + report.transactionCount, 0);

    const dateRange = this.getDateRange(query);

    return {
      revenue,
      totalRevenue,
      totalTransactions,
      dateRange,
    };
  }

  async getDemographicsReport(query: BaseReportQueryDto): Promise<DemographicsReportResponse> {
    const demographics: (FacebookDemographicsResponse | TiktokDemographicsResponse)[] = [];
    let totalUsers = 0;

    if (!query.source || query.source === ReportSource.FACEBOOK) {
      const facebookDemographics = await this.databaseService.getFacebookDemographics(query);
      demographics.push(facebookDemographics);

      const facebookUsers = Object.values(facebookDemographics.genderDistribution)
          .reduce((sum, count) => sum + count, 0);
      totalUsers += facebookUsers;
    }

    if (!query.source || query.source === ReportSource.TIKTOK) {
      const tiktokDemographics = await this.databaseService.getTiktokDemographics(query);
      demographics.push(tiktokDemographics);

      const tiktokUsers = tiktokDemographics.followerRanges
          .reduce((sum, range) => sum + range.count, 0);
      totalUsers += tiktokUsers;
    }

    const dateRange = this.getDateRange(query);

    return {
      demographics,
      totalUsers,
      dateRange,
    };
  }

  private getDateRange(query: BaseReportQueryDto) {
    const now = new Date();

    return {
      from: query.from || 'not specified',
      to: query.to || now.toISOString(),
    };
  }
}
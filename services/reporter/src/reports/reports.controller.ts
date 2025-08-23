import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { EventReportResponse } from '../responses/eventReport.response';
import { EventReportQueryDto } from '../dto/eventReportQueryDto';
import { RevenueReportResponse } from '../responses/revenueReport.response';
import { RevenueReportQueryDto } from '../dto/revenueReportQueryDto';
import { DemographicsReportResponse } from '../responses/demographicsReportResponse';
import { BaseReportQueryDto } from '../dto/baseReportQuery.dto';

@ApiTags('Reports')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('events')
  @ApiOperation({ summary: 'Get aggregated event statistics' })
  @ApiOkResponse({
    type: EventReportResponse,
  })
  async getEventReport(
      @Query(new ValidationPipe({ transform: true })) query: EventReportQueryDto,
  ): Promise<EventReportResponse> {
    return this.reportsService.getEventReport(query);
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get aggregated revenue data' })
  @ApiOkResponse({
    type: RevenueReportResponse,
  })
  async getRevenueReport(
      @Query(new ValidationPipe({ transform: true })) query: RevenueReportQueryDto,
  ): Promise<RevenueReportResponse> {
    return this.reportsService.getRevenueReport(query);
  }

  @Get('demographics')
  @ApiOperation({ summary: 'Get user demographic data' })
  @ApiOkResponse({
    type: DemographicsReportResponse,
  })
  async getDemographicsReport(
      @Query(new ValidationPipe({ transform: true })) query: BaseReportQueryDto,
  ): Promise<DemographicsReportResponse> {
    return this.reportsService.getDemographicsReport(query);
  }
}
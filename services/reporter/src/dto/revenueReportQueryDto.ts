import { BaseReportQueryDto } from './baseReportQuery.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RevenueReportQueryDto extends BaseReportQueryDto {
  @ApiPropertyOptional({ description: 'campaignId filter' })
  @IsOptional()
  @IsString()
  campaignId?: string;
}
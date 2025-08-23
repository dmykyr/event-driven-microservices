import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

export enum ReportSource {
  FACEBOOK = 'facebook',
  TIKTOK = 'tiktok',
}

export class BaseReportQueryDto {
  @ApiPropertyOptional({ description: 'Start date' })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiPropertyOptional({ description: 'End date' })
  @IsOptional()
  @IsDateString()
  to?: string;

  @ApiPropertyOptional({ enum: ReportSource })
  @IsOptional()
  @IsEnum(ReportSource)
  source?: ReportSource;
}
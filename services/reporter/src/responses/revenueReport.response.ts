import { ApiProperty } from '@nestjs/swagger';

export class RevenueReport {
  @ApiProperty()
  source: string;

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  transactionCount: number;

  @ApiProperty()
  averageOrderValue: number;

  @ApiProperty({ required: false })
  campaignId?: string;
}

export class RevenueReportResponse {
  @ApiProperty({ type: [RevenueReport] })
  revenue: RevenueReport[];

  @ApiProperty()
  totalRevenue: number;

  @ApiProperty()
  totalTransactions: number;

  @ApiProperty()
  dateRange: {
    from: string;
    to: string;
  };
}
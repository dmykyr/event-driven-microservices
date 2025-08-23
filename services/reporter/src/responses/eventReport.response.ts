import { ApiProperty } from '@nestjs/swagger';

export class EventReport {
  @ApiProperty()
  eventType: string;

  @ApiProperty()
  count: number;

  @ApiProperty()
  source: string;

  @ApiProperty()
  funnelStage: string;
}

export class EventReportResponse {
  @ApiProperty({ type: [EventReport] })
  events: EventReport[];

  @ApiProperty()
  totalEvents: number;

  @ApiProperty()
  dateRange: {
    from: string;
    to: string;
  };
}
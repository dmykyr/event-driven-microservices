import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { FacebookDemographicsResponse } from './facebookDemographics.response';
import { TiktokDemographicsResponse } from './tiktokDemographics.response';

export class TopCountryResponse {
  @ApiProperty()
  country: string;
  @ApiProperty()
  count: number;
  @ApiProperty()
  percentage: number;
}

export class DateRangeResponse {
  @ApiProperty()
  from: string;
  @ApiProperty()
  to: string;
}

export class DemographicsReportResponse {
  @ApiProperty({
    oneOf: [
      {
        type: 'array',
        items: { $ref: getSchemaPath(FacebookDemographicsResponse) }
      },
      {
        type: 'array',
        items: { $ref: getSchemaPath(TiktokDemographicsResponse) }
      }
    ]
  })
  demographics: (FacebookDemographicsResponse | TiktokDemographicsResponse)[];

  @ApiProperty()
  totalUsers: number;

  @ApiProperty()
  dateRange: DateRangeResponse;
}
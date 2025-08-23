import { ApiProperty } from '@nestjs/swagger';
import { TopCountryResponse } from './demographicsReportResponse';

export class FollowersRangeReportResponse {
  @ApiProperty()
  range: string;
  @ApiProperty()
  count: number;
  @ApiProperty()
  percentage: number;
}

export class TiktokDemographicsResponse {
  @ApiProperty()
  source: 'tiktok';

  @ApiProperty()
  averageFollowers: number;

  @ApiProperty({type: [FollowersRangeReportResponse]})
  followerRanges: FollowersRangeReportResponse[];

  @ApiProperty({type: [TopCountryResponse]})
  topCountries: TopCountryResponse[];

  @ApiProperty()
  averageWatchTime: number;

  @ApiProperty()
  averagePercentageWatched: number;
}
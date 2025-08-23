import { ApiProperty } from '@nestjs/swagger';
import { TopCountryResponse } from './demographicsReportResponse';

export class GenderDistributionResponse {
  @ApiProperty()
  male: number;
  @ApiProperty()
  female: number;
  @ApiProperty()
  nonBinary: number;
}

export class TopCityResponse {
  @ApiProperty()
  city: string;
  @ApiProperty()
  country: string;
  @ApiProperty()
  count: number;
  @ApiProperty()
  percentage: number;
}

export class FacebookDemographicsResponse {
  @ApiProperty()
  source: 'facebook';

  @ApiProperty()
  averageAge: number;

  @ApiProperty()
  genderDistribution: GenderDistributionResponse;

  @ApiProperty({type: [TopCountryResponse]})
  topCountries: TopCountryResponse[];

  @ApiProperty({type: [TopCityResponse]})
  topCities: TopCityResponse[];
}
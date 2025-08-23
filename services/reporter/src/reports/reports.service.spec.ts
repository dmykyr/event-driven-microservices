import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { DatabaseService } from '../database/database.service';
import { ReportSource } from '../dto/baseReportQuery.dto';

describe('ReportsService', () => {
  let service: ReportsService;
  let databaseService: jest.Mocked<DatabaseService>;

  beforeEach(async () => {
    const mockDatabaseService = {
      getEventStatistics: jest.fn(),
      getRevenueStatistics: jest.fn(),
      getFacebookDemographics: jest.fn(),
      getTiktokDemographics: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    databaseService = module.get(DatabaseService);
  });

  describe('getEventReport', () => {
    it('should return event statistics with totals', async () => {
      const mockEvents = [
        { eventType: 'ad.view', count: 100, source: 'facebook', funnelStage: 'top' },
        { eventType: 'video.view', count: 50, source: 'tiktok', funnelStage: 'top' },
      ];

      databaseService.getEventStatistics.mockResolvedValue(mockEvents);

      const result = await service.getEventReport({});

      expect(result.events).toEqual(mockEvents);
      expect(result.totalEvents).toBe(150);
      expect(result.dateRange).toBeDefined();
      expect(result.dateRange.from).toBeDefined();
      expect(result.dateRange.to).toBeDefined();
    });
  });

  describe('getRevenueReport', () => {
    it('should return revenue statistics with totals', async () => {
      const mockRevenue = [
        {
          source: 'facebook',
          totalRevenue: 1000,
          transactionCount: 10,
          averageOrderValue: 100,
        },
      ];

      databaseService.getRevenueStatistics.mockResolvedValue(mockRevenue);

      const result = await service.getRevenueReport({});

      expect(result.revenue).toEqual(mockRevenue);
      expect(result.totalRevenue).toBe(1000);
      expect(result.totalTransactions).toBe(10);
      expect(result.dateRange).toBeDefined();
    });
  });

  describe('getDemographicsReport', () => {
    it('should return demographics for both platforms when no source filter', async () => {
      const mockFacebookDemographics = {
        source: 'facebook' as const,
        averageAge: 25,
        genderDistribution: { male: 60, female: 40, nonBinary: 5 },
        topCountries: [],
        topCities: [],
      };

      const mockTiktokDemographics = {
        source: 'tiktok' as const,
        averageFollowers: 5000,
        followerRanges: [{ range: '1K-10K', count: 100, percentage: 50 }],
        topCountries: [],
        averageWatchTime: 30,
        averagePercentageWatched: 75,
      };

      databaseService.getFacebookDemographics.mockResolvedValue(mockFacebookDemographics);
      databaseService.getTiktokDemographics.mockResolvedValue(mockTiktokDemographics);

      const result = await service.getDemographicsReport({});

      expect(result.demographics).toHaveLength(2);
      expect(result.totalUsers).toBe(205);
      expect(result.dateRange).toBeDefined();
    });

    it('should return only Facebook demographics when source is facebook', async () => {
      const mockFacebookDemographics = {
        source: 'facebook' as const,
        averageAge: 25,
        genderDistribution: { male: 60, female: 40, nonBinary: 5 },
        topCountries: [],
        topCities: [],
      };

      databaseService.getFacebookDemographics.mockResolvedValue(mockFacebookDemographics);

      const result = await service.getDemographicsReport({ source: ReportSource.FACEBOOK });

      expect(result.demographics).toHaveLength(1);
      expect(result.demographics[0]).toEqual(mockFacebookDemographics);
      expect(result.totalUsers).toBe(105);
      expect(databaseService.getTiktokDemographics).not.toHaveBeenCalled();
    });
  });
});
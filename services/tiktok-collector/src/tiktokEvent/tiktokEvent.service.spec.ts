import { Test, TestingModule } from '@nestjs/testing';
import { TiktokEventService } from './tiktokEvent.service';
import { DatabaseService } from '../database/database.service';
import { TiktokEventMapper } from './tiktokEvent.mapper';
import { TiktokEventDto } from '@event-driven-microservices/types';
import { TiktokEvent } from '@event-driven-microservices/database';

jest.mock('./tiktokEvent.mapper');

describe('TiktokEventService', () => {
  let service: TiktokEventService;
  let databaseService: jest.Mocked<DatabaseService>;

  const mockTiktokEventDto: TiktokEventDto = {
    eventId: 'id',
    timestamp: '2025-01-01T00:00:00Z',
    source: 'tiktok',
    funnelStage: 'top',
    eventType: 'video.view',
    data: {
      user: {
        userId: 'id',
        username: 'User',
        followers: 200
      },
      engagement: {
        watchTime: 16,
        percentageWatched: 25,
        device: 'Android',
        country: 'Ukraine',
        videoId: 'id'
      }
    }
  };

  const mockDatabaseEvent: TiktokEvent = {
    id: 'id',
    timestamp: new Date('2025-01-01T00:00:00Z'),
    funnelStage: 'top',
    eventType: 'videoView',
    userId: 'id',
    username: 'User',
    followers: 200,
    watchTime: 16,
    percentageWatched: 25,
    device: 'android',
    country: 'Ukraine',
    videoId: 'id',
    actionTime: null,
    profileId: null,
    purchasedItem: null,
    purchaseAmount: null,
  };

  beforeEach(async () => {
    const mockDatabaseService = {
      createEvent: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TiktokEventService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService
        }
      ]
    }).compile();

    service = module.get<TiktokEventService>(TiktokEventService);
    databaseService = module.get(DatabaseService);

    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const mockedMapper = TiktokEventMapper as jest.Mocked<typeof TiktokEventMapper>;
      mockedMapper.toEntity.mockReturnValue(mockDatabaseEvent);
      databaseService.createEvent.mockResolvedValue(mockDatabaseEvent);

      const result = await service.createEvent(mockTiktokEventDto);

      expect(TiktokEventMapper.toEntity).toHaveBeenCalledWith(mockTiktokEventDto);
      expect(databaseService.createEvent).toHaveBeenCalledWith(mockDatabaseEvent);
      expect(result).toBe(mockDatabaseEvent);
    });

    it('should handle database errors', async () => {
      const mockedMapper = TiktokEventMapper as jest.Mocked<typeof TiktokEventMapper>;
      mockedMapper.toEntity.mockReturnValue(mockDatabaseEvent);
      const error = new Error('Database connection failed');
      databaseService.createEvent.mockRejectedValue(error);

      await expect(service.createEvent(mockTiktokEventDto)).rejects.toThrow('Database connection failed');
      expect(TiktokEventMapper.toEntity).toHaveBeenCalledWith(mockTiktokEventDto);
      expect(databaseService.createEvent).toHaveBeenCalledWith(mockDatabaseEvent);
    });

    it('should handle mapper errors', async () => {
      const mockedMapper = TiktokEventMapper as jest.Mocked<typeof TiktokEventMapper>;
      const error = new Error('Mapping failed');
      mockedMapper.toEntity.mockImplementation(() => {
        throw error;
      });

      await expect(service.createEvent(mockTiktokEventDto)).rejects.toThrow('Mapping failed');
      expect(TiktokEventMapper.toEntity).toHaveBeenCalledWith(mockTiktokEventDto);
      expect(databaseService.createEvent).not.toHaveBeenCalled();
    });
  });
});
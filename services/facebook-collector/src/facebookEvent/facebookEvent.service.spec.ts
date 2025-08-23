import { Test, TestingModule } from '@nestjs/testing';
import { FacebookEventService } from './facebookEvent.service';
import { DatabaseService } from '../database/database.service';
import { FacebookEventMapper } from './facebookEvent.mapper';
import { FacebookEventDto } from '@event-driven-microservices/types';
import { FacebookEvent } from '@event-driven-microservices/database';

jest.mock('./facebookEvent.mapper');

describe('FacebookEventService', () => {
  let service: FacebookEventService;
  let databaseService: jest.Mocked<DatabaseService>;

  const mockFacebookEventDto: FacebookEventDto = {
    eventId: 'id',
    timestamp: '2025-01-01T00:00:00Z',
    source: 'facebook',
    funnelStage: 'top',
    eventType: 'ad.view',
    data: {
      user: {
        userId: 'id',
        name: 'User',
        age: 25,
        gender: 'male',
        location: {
          country: 'Ukraine',
          city: 'Kyiv'
        }
      },
      engagement: {
        actionTime: '2025-01-01T00:00:00Z',
        referrer: 'newsfeed',
        videoId: 'id'
      }
    }
  };

  const mockDatabaseEvent: FacebookEvent = {
    id: 'id',
    timestamp: new Date('2025-01-01T00:00:00Z'),
    funnelStage: 'top',
    eventType: 'adView',
    userId: 'id',
    userName: 'User',
    userAge: 25,
    userGender: 'male',
    userCountry: 'Ukraine',
    userCity: 'Kyiv',
    actionTime: new Date('2025-01-01T00:00:00Z'),
    referrer: 'newsfeed',
    videoId: 'id',
    adId: null,
    campaignId: null,
    clickPosition: null,
    device: null,
    browser: null,
    purchaseAmount: null
  };

  beforeEach(async () => {
    const mockDatabaseService = {
      createEvent: jest.fn()
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacebookEventService,
        {
          provide: DatabaseService,
          useValue: mockDatabaseService
        }
      ]
    }).compile();

    service = module.get<FacebookEventService>(FacebookEventService);
    databaseService = module.get(DatabaseService);

    jest.clearAllMocks();
  });

  describe('createEvent', () => {
    it('should create an event successfully', async () => {
      const mockedMapper = FacebookEventMapper as jest.Mocked<typeof FacebookEventMapper>;
      mockedMapper.toEntity.mockReturnValue(mockDatabaseEvent);
      databaseService.createEvent.mockResolvedValue(mockDatabaseEvent);

      const result = await service.createEvent(mockFacebookEventDto);

      expect(FacebookEventMapper.toEntity).toHaveBeenCalledWith(mockFacebookEventDto);
      expect(databaseService.createEvent).toHaveBeenCalledWith(mockDatabaseEvent);
      expect(result).toBe(mockDatabaseEvent);
    });

    it('should handle database errors', async () => {
      // Arrange
      const mockedMapper = FacebookEventMapper as jest.Mocked<typeof FacebookEventMapper>;
      mockedMapper.toEntity.mockReturnValue(mockDatabaseEvent);
      const error = new Error('Database connection failed');
      databaseService.createEvent.mockRejectedValue(error);

      // Act & Assert
      await expect(service.createEvent(mockFacebookEventDto)).rejects.toThrow('Database connection failed');
      expect(FacebookEventMapper.toEntity).toHaveBeenCalledWith(mockFacebookEventDto);
      expect(databaseService.createEvent).toHaveBeenCalledWith(mockDatabaseEvent);
    });

    it('should handle mapper errors', async () => {
      // Arrange
      const mockedMapper = FacebookEventMapper as jest.Mocked<typeof FacebookEventMapper>;
      const error = new Error('Mapping failed');
      mockedMapper.toEntity.mockImplementation(() => {
        throw error;
      });

      // Act & Assert
      await expect(service.createEvent(mockFacebookEventDto)).rejects.toThrow('Mapping failed');
      expect(FacebookEventMapper.toEntity).toHaveBeenCalledWith(mockFacebookEventDto);
      expect(databaseService.createEvent).not.toHaveBeenCalled();
    });
  });
});
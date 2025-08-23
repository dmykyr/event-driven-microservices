import { TiktokEventMapper } from './tiktokEvent.mapper';
import { TiktokEventDto } from '@event-driven-microservices/types';
import { Prisma } from '@event-driven-microservices/database';

describe('TiktokEventMapper', () => {
  describe('toEntity', () => {
    const baseUser = {
      userId: 'id',
      username: 'User',
      followers: 200
    };

    describe('Top funnel stage events', () => {
      const topEventDto: TiktokEventDto = {
        eventId: 'id',
        timestamp: '2025-01-01T00:00:00Z',
        source: 'tiktok',
        funnelStage: 'top',
        eventType: 'video.view',
        data: {
          user: baseUser,
          engagement: {
            watchTime: 16,
            percentageWatched: 25,
            device: 'Android',
            country: 'Ukraine',
            videoId: 'id'
          }
        }
      };

      it('should map top funnel event correctly', () => {
        const result = TiktokEventMapper.toEntity(topEventDto);

        expect(result).toEqual({
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
        });
      });

      it('should handle null videoId for top funnel events', () => {
        const adjustedTopEventDto: TiktokEventDto = topEventDto;
        adjustedTopEventDto.data.engagement.videoId = null;

        const result = TiktokEventMapper.toEntity(topEventDto);

        expect(result.videoId).toBeNull();
      });

      it('should map all top event types correctly', () => {
        const topEventTypes = [
          { type: 'video.view' as const, entity: 'videoView' },
          { type: 'like' as const, entity: 'like' },
          { type: 'share' as const, entity: 'share' },
          { type: 'comment' as const, entity: 'comment' }
        ];

        topEventTypes.forEach(({ type, entity }) => {
          let eventDto: TiktokEventDto = topEventDto;
          eventDto.eventType = type;

          const result = TiktokEventMapper.toEntity(eventDto);
          expect(result.eventType).toBe(entity);
        });
      });

      it('should map all devices correctly', () => {
        const browsers = [
          { browser: 'Android' as const, entity: 'android' },
          { browser: 'iOS' as const, entity: 'ios' },
          { browser: 'Desktop' as const, entity: 'desktop' }
        ];

        browsers.forEach(({ browser, entity }) => {
          let eventDto: TiktokEventDto = topEventDto;
          eventDto.data.engagement.device = browser;

          const result = TiktokEventMapper.toEntity(eventDto);
          expect(result.device).toBe(entity);
        });
      });
    });

    describe('Bottom funnel stage events', () => {
      const bottomEventDto: TiktokEventDto = {
        eventId: 'id',
        timestamp: '2025-01-01T00:00:00Z',
        source: 'tiktok',
        funnelStage: 'bottom',
        eventType: 'follow',
        data: {
          user: baseUser,
          engagement: {
            actionTime: '2025-01-01T00:00:00Z',
            profileId: 'id',
            purchasedItem: 'item',
            purchaseAmount: '2',
          }
        }
      };

      it('should map bottom funnel event correctly', () => {
        const result = TiktokEventMapper.toEntity(bottomEventDto);

        expect(result).toEqual({
          id: 'id',
          timestamp: new Date('2025-01-01T00:00:00Z'),
          funnelStage: 'bottom',
          eventType: 'follow',
          userId: 'id',
          username: 'User',
          followers: 200,
          watchTime: null,
          percentageWatched: null,
          device: null,
          country: null,
          videoId: null,
          actionTime: new Date('2025-01-01T00:00:00Z'),
          profileId: 'id',
          purchasedItem: 'item',
          purchaseAmount: new Prisma.Decimal('2'),
        });
      });

      it('should handle null purchaseAmount for bottom funnel events', () => {
        let adjustedBottomEventDto: TiktokEventDto = bottomEventDto;
        adjustedBottomEventDto.data.engagement.purchaseAmount = null;

        const result = TiktokEventMapper.toEntity(bottomEventDto);

        expect(result.purchaseAmount).toBeNull();
      });

      it('should map all bottom event types correctly', () => {
        const bottomEventTypes = [
          { type: 'profile.visit' as const, entity: 'profileVisit' },
          { type: 'purchase' as const, entity: 'purchase' },
          { type: 'follow' as const, entity: 'follow' }
        ];

        bottomEventTypes.forEach(({ type, entity }) => {
          let eventDto: TiktokEventDto = bottomEventDto;
          eventDto.eventType = type

          const result = TiktokEventMapper.toEntity(eventDto);
          expect(result.eventType).toBe(entity);
        });
      });
    });
  });
});
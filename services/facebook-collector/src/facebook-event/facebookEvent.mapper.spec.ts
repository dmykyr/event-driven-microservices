import { FacebookEventMapper } from './facebookEvent.mapper';
import { FacebookEventDto } from '../dto/facebookEvent.dto';
import { Prisma } from '@event-driven-microservices/database';

describe('FacebookEventMapper', () => {
  describe('toEntity', () => {
    const baseUser = {
      userId: 'id',
      name: 'User',
      age: 25,
      gender: 'male' as const,
      location: {
        country: 'Ukraine',
        city: 'Kyiv'
      }
    };

    describe('Top funnel stage events', () => {
      const topEventDto: FacebookEventDto = {
        eventId: 'id',
        timestamp: '2025-01-01T00:00:00Z',
        source: 'facebook',
        funnelStage: 'top',
        eventType: 'ad.view',
        data: {
          user: baseUser,
          engagement: {
            actionTime: '2025-01-01T00:00:00Z',
            referrer: 'newsfeed',
            videoId: 'id'
          }
        }
      };

      it('should map top funnel event correctly', () => {
        const result = FacebookEventMapper.toEntity(topEventDto);

        expect(result).toEqual({
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
        });
      });

      it('should handle null videoId for top funnel events', () => {
        const adjustedTopEventDto: FacebookEventDto = topEventDto;
        adjustedTopEventDto.data.engagement.videoId = null;

        const result = FacebookEventMapper.toEntity(topEventDto);

        expect(result.videoId).toBeNull();
      });

      it('should map all top event types correctly', () => {
        const topEventTypes = [
          { type: 'ad.view' as const, entity: 'adView' },
          { type: 'page.like' as const, entity: 'pageLike' },
          { type: 'comment' as const, entity: 'comment' },
          { type: 'video.view' as const, entity: 'videoView' }
        ];

        topEventTypes.forEach(({ type, entity }) => {
          let eventDto: FacebookEventDto = topEventDto;
          eventDto.eventType = type;

          const result = FacebookEventMapper.toEntity(eventDto);
          expect(result.eventType).toBe(entity);
        });
      });
    });

    describe('Bottom funnel stage events', () => {
      const bottomEventDto: FacebookEventDto = {
        eventId: 'id',
        timestamp: '2025-01-01T00:00:00Z',
        source: 'facebook',
        funnelStage: 'bottom',
        eventType: 'ad.click',
        data: {
          user: baseUser,
          engagement: {
            adId: 'id',
            campaignId: 'id',
            clickPosition: 'top_left',
            device: 'desktop',
            browser: 'Chrome',
            purchaseAmount: '107.56'
          }
        }
      };

      it('should map bottom funnel event correctly', () => {
        const result = FacebookEventMapper.toEntity(bottomEventDto);

        expect(result).toEqual({
          id: 'id',
          timestamp: new Date('2025-01-01T00:00:00Z'),
          funnelStage: 'bottom',
          eventType: 'adClick',
          userId: 'id',
          userName: 'User',
          userAge: 25,
          userGender: 'male',
          userCountry: 'Ukraine',
          userCity: 'Kyiv',
          actionTime: null,
          referrer: null,
          videoId: null,
          adId: 'id',
          campaignId: 'id',
          clickPosition: 'topLeft',
          device: 'desktop',
          browser: 'chrome',
          purchaseAmount: new Prisma.Decimal('107.56')
        });
      });

      it('should handle null purchaseAmount for bottom funnel events', () => {
        let adjustedBottomEventDto: FacebookEventDto = bottomEventDto;
        adjustedBottomEventDto.data.engagement.purchaseAmount = null;

        const result = FacebookEventMapper.toEntity(bottomEventDto);

        expect(result.purchaseAmount).toBeNull();
      });

      it('should map all bottom event types correctly', () => {
        const bottomEventTypes = [
          { type: 'ad.click' as const, entity: 'adClick' },
          { type: 'form.submission' as const, entity: 'formSubmission' },
          { type: 'checkout.complete' as const, entity: 'checkoutComplete' }
        ];

        bottomEventTypes.forEach(({ type, entity }) => {
          let eventDto: FacebookEventDto = bottomEventDto;
          eventDto.eventType = type

          const result = FacebookEventMapper.toEntity(eventDto);
          expect(result.eventType).toBe(entity);
        });
      });

      it('should map all click positions correctly', () => {
        const clickPositions = [
          { position: 'top_left' as const, entity: 'topLeft' },
          { position: 'bottom_right' as const, entity: 'bottomRight' },
          { position: 'center' as const, entity: 'center' }
        ];

        clickPositions.forEach(({ position, entity }) => {
          let eventDto: FacebookEventDto = bottomEventDto;
          eventDto.data.engagement.clickPosition = position;

          const result = FacebookEventMapper.toEntity(eventDto);
          expect(result.clickPosition).toBe(entity);
        });
      });

      it('should map all browsers correctly', () => {
        const browsers = [
          { browser: 'Chrome' as const, entity: 'chrome' },
          { browser: 'Firefox' as const, entity: 'firefox' },
          { browser: 'Safari' as const, entity: 'safari' }
        ];

        browsers.forEach(({ browser, entity }) => {
          let eventDto: FacebookEventDto = bottomEventDto;
          eventDto.data.engagement.browser = browser;

          const result = FacebookEventMapper.toEntity(eventDto);
          expect(result.browser).toBe(entity);
        });
      });
    });

    describe('Gender mapping', () => {
      it('should map all genders correctly', () => {
        const genders = [
          { gender: 'male' as const, entity: 'male' },
          { gender: 'female' as const, entity: 'female' },
          { gender: 'non-binary' as const, entity: 'nonBinary' }
        ];

        genders.forEach(({ gender, entity }) => {
          const eventDto: FacebookEventDto = {
            eventId: 'id',
            timestamp: '2025-01-01T00:00:00Z',
            source: 'facebook',
            funnelStage: 'top',
            eventType: 'ad.view',
            data: {
              user: {
                ...baseUser,
                gender,
              },
              engagement: {
                actionTime: '2025-01-01T00:00:00Z',
                referrer: 'newsfeed',
                videoId: null
              }
            }
          };

          const result = FacebookEventMapper.toEntity(eventDto);
          expect(result.userGender).toBe(entity);
        });
      });
    });
  });
});
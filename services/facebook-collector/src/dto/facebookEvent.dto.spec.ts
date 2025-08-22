import {
  FacebookBottomEventTypeSchema,
  FacebookEngagementBottomSchema,
  FacebookEngagementTopSchema,
  FacebookEventDtoSchema,
  FacebookTopEventTypeSchema,
  FacebookUserSchema
} from './facebookEvent.dto';

describe('FacebookEventDto Schema', () => {
  describe('FacebookTopEventTypeSchema', () => {
    it('should validate correct top event types', () => {
      const validTypes = ['ad.view', 'page.like', 'comment', 'video.view'];

      validTypes.forEach(type => {
        expect(() => FacebookTopEventTypeSchema.parse(type)).not.toThrow();
      });
    });

    it('should reject invalid top event types', () => {
      const invalidTypes = ['wrong type', 'invalid.type', '', null];

      invalidTypes.forEach(type => {
        expect(() => FacebookTopEventTypeSchema.parse(type)).toThrow();
      });
    });
  });

  describe('FacebookBottomEventTypeSchema', () => {
    it('should validate correct bottom event types', () => {
      const validTypes = ['ad.click', 'form.submission', 'checkout.complete'];

      validTypes.forEach(type => {
        expect(() => FacebookBottomEventTypeSchema.parse(type)).not.toThrow();
      });
    });

    it('should reject invalid bottom event types', () => {
      const invalidTypes = ['wrong type', 'invalid.type', '', null];

      invalidTypes.forEach(type => {
        expect(() => FacebookBottomEventTypeSchema.parse(type)).toThrow();
      });
    });
  });

  describe('FacebookUserSchema', () => {
    const validUser = {
      userId: 'id',
      name: 'User',
      age: 25,
      gender: 'male',
      location: {
        country: 'Ukraine',
        city: 'Kyiv'
      }
    };

    it('should validate a correct user object', () => {
      expect(() => FacebookUserSchema.parse(validUser)).not.toThrow();
    });

    it('should reject user with invalid age', () => {
      const invalidUser = { ...validUser, age: -2 };
      expect(() => FacebookUserSchema.parse(invalidUser)).toThrow();
    });

    it('should reject user with empty name', () => {
      const invalidUser = { ...validUser, name: '' };
      expect(() => FacebookUserSchema.parse(invalidUser)).toThrow();
    });

    it('should reject user with invalid gender', () => {
      const invalidUser = { ...validUser, gender: 'unknown' };
      expect(() => FacebookUserSchema.parse(invalidUser)).toThrow();
    });

    it('should reject user with empty location fields', () => {
      const invalidUser = { ...validUser, location: { country: '', city: '' } };
      expect(() => FacebookUserSchema.parse(invalidUser)).toThrow();
    });
  });

  describe('FacebookEngagementTopSchema', () => {
    it('should validate correct top engagement data', () => {
      const validEngagement = {
        actionTime: '2025-01-01T00:00:00Z',
        referrer: 'newsfeed',
        videoId: 'id'
      };

      expect(() => FacebookEngagementTopSchema.parse(validEngagement)).not.toThrow();
    });

    it('should validate with null videoId', () => {
      const validEngagement = {
        actionTime: '2025-01-01T00:00:00Z',
        referrer: 'newsfeed',
        videoId: null
      };

      expect(() => FacebookEngagementTopSchema.parse(validEngagement)).not.toThrow();
    });

    it('should reject invalid datetime', () => {
      const invalidEngagement = {
        actionTime: 'unknown time',
        referrer: 'newsfeed',
        videoId: 'id'
      };

      expect(() => FacebookEngagementTopSchema.parse(invalidEngagement)).toThrow();
    });
  });

  describe('FacebookEngagementBottomSchema', () => {
    it('should validate correct bottom engagement data', () => {
      const validEngagement = {
        adId: 'id',
        campaignId: 'id',
        clickPosition: 'center',
        device: 'mobile',
        browser: 'Chrome',
        purchaseAmount: '107.56'
      };

      expect(() => FacebookEngagementBottomSchema.parse(validEngagement)).not.toThrow();
    });

    it('should validate with null purchaseAmount', () => {
      const validEngagement = {
        adId: 'id',
        campaignId: 'id',
        clickPosition: 'center',
        device: 'mobile',
        browser: 'Chrome',
        purchaseAmount: null
      };

      expect(() => FacebookEngagementBottomSchema.parse(validEngagement)).not.toThrow();
    });

    it('should reject invalid purchase amount', () => {
      const invalidEngagement = {
        adId: '123',
        campaignId: '123',
        clickPosition: 'center',
        device: 'mobile',
        browser: 'Chrome',
        purchaseAmount: 'dd33'
      };

      expect(() => FacebookEngagementBottomSchema.parse(invalidEngagement)).toThrow();
    });
  });

  describe('FacebookEventDtoSchema', () => {
    const baseEvent = {
      eventId: 'id',
      timestamp: '2025-01-01T00:00:00Z',
      source: 'facebook',
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
        }
      }
    };

    it('should validate top funnel event', () => {
      const topEvent = {
        ...baseEvent,
        funnelStage: 'top',
        eventType: 'ad.view',
        data: {
          ...baseEvent.data,
          engagement: {
            actionTime: '2025-01-01T00:00:00Z',
            referrer: 'newsfeed',
            videoId: 'id'
          }
        }
      };

      expect(() => FacebookEventDtoSchema.parse(topEvent)).not.toThrow();
    });

    it('should validate bottom funnel event', () => {
      const bottomEvent = {
        ...baseEvent,
        funnelStage: 'bottom',
        eventType: 'ad.click',
        data: {
          ...baseEvent.data,
          engagement: {
            adId: 'id',
            campaignId: 'id',
            clickPosition: 'center',
            device: 'mobile',
            browser: 'Chrome',
            purchaseAmount: '107.56'
          }
        }
      };

      expect(() => FacebookEventDtoSchema.parse(bottomEvent)).not.toThrow();
    });

    it('should throw exception on mismatched funnel stage and event type', () => {
      const wrongEventType = 'ad.click'
      const invalidEvent = {
        ...baseEvent,
        funnelStage: 'top',
        eventType: wrongEventType,
        data: {
          ...baseEvent.data,
          engagement: {
            actionTime: '2025-01-01T00:00:00Z',
            referrer: 'newsfeed',
            videoId: 'id'
          }
        }
      };

      expect(() => FacebookEventDtoSchema.parse(invalidEvent)).toThrow();
    });

    it('should throw exception on wrong engagement data for funnel stage', () => {
      const validEngagementTop = {
        actionTime: '2025-01-01T10:00:00Z',
        referrer: 'newsfeed',
        videoId: 'id'
      }

      const invalidEvent = {
        ...baseEvent,
        funnelStage: 'bottom',
        eventType: 'ad.click',
        data: {
          ...baseEvent.data,
          engagement: validEngagementTop,
        }
      };

      expect(() => FacebookEventDtoSchema.parse(invalidEvent)).toThrow();
    });
  });
});
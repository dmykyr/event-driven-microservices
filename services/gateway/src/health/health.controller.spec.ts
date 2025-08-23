import { Test, TestingModule } from '@nestjs/testing';
import { WebhooksController } from '../webhook/webhooks.controller';
import { AppService } from '../app.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [WebhooksController],
      providers: [AppService],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('health', () => {
    it('should return healthy result with correct structure', () => {
      const result = healthController.checkHealth();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(typeof result.timestamp).toBe('string');
    });
  });
});

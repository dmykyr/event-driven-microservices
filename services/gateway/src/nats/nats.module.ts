import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NatsService } from './nats.service';
import { WinstonLoggerService } from '@event-driven-microservices/logger';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: NatsService,
      useFactory: (configService: ConfigService, logger: WinstonLoggerService) => {
        return new NatsService(
          configService.get<string>('NATS_TOKEN'),
          configService.get<string>('NATS_NKEY_SEED'),
          configService.get<string[]>('NATS_SERVERS'),
          logger,
        );
      },
      inject: [ConfigService, WinstonLoggerService],
    },
  ],
  exports: [NatsService],
})
export class NatsModule {}
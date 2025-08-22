import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NatsService } from './nats.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: NatsService,
      useFactory: (configService: ConfigService) => {
        return new NatsService(
          configService.get<string>('NATS_TOKEN'),
            configService.get<string>('NATS_NKEY_SEED'),
          configService.get<string[]>('NATS_SERVERS'),
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [NatsService],
})
export class NatsModule {}
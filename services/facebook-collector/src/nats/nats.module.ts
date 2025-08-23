import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NatsService } from './nats.service';
import { WinstonLoggerService } from '@event-driven-microservices/logger';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }),],
  providers: [
    {
      provide: NatsService,
      useFactory: (logger: WinstonLoggerService) => {
        return new NatsService(logger);
      },
      inject: [WinstonLoggerService],
    },
  ],
  exports: [NatsService],
})
export class NatsModule {}
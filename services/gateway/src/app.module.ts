import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { NatsModule } from './nats/nats.module';

@Module({
  imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      NatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(express.json({ limit: '50mb' }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.info(`Started service on ${port} port`);
}
bootstrap();

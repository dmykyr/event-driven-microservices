import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.use(express.json({ limit: '50mb' }));

  const gracefulShutdown = (signal: string) => {
    console.log(`Received ${signal}, starting graceful shutdown`);

    app.close().then(() => {
      console.log('Application closed successfully');
      process.exit(0);
    }).catch((error) => {
      console.error('Error during shutdown:', error);
      process.exit(1);
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    gracefulShutdown('unhandledRejection');
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  console.info(`Started service on ${port} port`);
}
bootstrap();

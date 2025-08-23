import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { WinstonLoggerService } from '@event-driven-microservices/logger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();
  app.use(express.json({ limit: '50mb' }));

  const logger = app.get(WinstonLoggerService);
  app.useLogger(logger);

  const gracefulShutdown = (signal: string) => {
    logger.log(`Received ${signal}, starting graceful shutdown`);

    app.close().then(() => {
      logger.log('Application closed successfully');
      process.exit(0);
    }).catch((error) => {
      logger.error('Error during shutdown:', error);
      process.exit(1);
    });
  };

  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error}`);
    gracefulShutdown('uncaughtException');
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    gracefulShutdown('unhandledRejection');
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Started service on ${port} port`);
}
bootstrap();

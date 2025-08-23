import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, Logger as WinstonLogger } from './logger';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: WinstonLogger;

  constructor(serviceName: string) {
    this.logger = createLogger(serviceName);
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  http(message: string, meta?: any) {
    this.logger.http(message, meta);
  }
}
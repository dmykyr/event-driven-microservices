import { Module, DynamicModule, Global } from '@nestjs/common';
import { WinstonLoggerService } from './logger.service';

export interface LoggerModuleOptions {
  serviceName: string;
}

@Global()
@Module({})
export class LoggerModule {
  static forRoot(options: LoggerModuleOptions): DynamicModule {
    const loggerProvider = {
      provide: WinstonLoggerService,
      useFactory: () => {
        return new WinstonLoggerService(options.serviceName);
      },
    };

    return {
      module: LoggerModule,
      providers: [loggerProvider],
      exports: [WinstonLoggerService],
    };
  }
}
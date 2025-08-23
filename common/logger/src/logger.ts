import * as winston from 'winston';

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(logColors);

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

const createLogger = (serviceName: string) => {
  const formats = [];

  formats.push(winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }));

  formats.push(winston.format.label({ label: serviceName }));

  formats.push(winston.format.errors({ stack: true }));

  const developmentFormat = winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.printf(({ timestamp, level, message, label, stack }) => {
        if (stack) {
          return `[${timestamp}] [${label}] ${level}: ${message}\n${stack}`;
        }
        return `[${timestamp}] [${label}] ${level}: ${message}`;
      })
  );

  const productionFormat = winston.format.combine(
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, label, stack, ...meta }) => {
        const logObject = {
          timestamp,
          level,
          service: label,
          message,
          ...(Object.keys(meta).length && { meta }),
          ...(stack && { stack })
        };
        return JSON.stringify(logObject);
      })
  );

  const isDevelopment = process.env.NODE_ENV === 'development';
  formats.push(isDevelopment ? developmentFormat : productionFormat);

  return winston.createLogger({
    level: level(),
    levels: logLevels,
    format: winston.format.combine(...formats),
    transports: [
      new winston.transports.Console(),

      ...(isDevelopment ? [] : [
        new winston.transports.File({
          filename: `logs/${serviceName}-error.log`,
          level: 'error',
          maxsize: 5242880,
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: `logs/${serviceName}-combined.log`,
          maxsize: 5242880,
          maxFiles: 5,
        }),
      ]),
    ],

    exceptionHandlers: [
      new winston.transports.Console(),
      ...(isDevelopment ? [] : [
        new winston.transports.File({
          filename: `logs/${serviceName}-exceptions.log`,
        }),
      ]),
    ],
    rejectionHandlers: [
      new winston.transports.Console(),
      ...(isDevelopment ? [] : [
        new winston.transports.File({
          filename: `logs/${serviceName}-rejections.log`,
        }),
      ]),
    ],
  });
};

export { createLogger };
export interface Logger {
  error: (message: string, meta?: any) => void;
  warn: (message: string, meta?: any) => void;
  info: (message: string, meta?: any) => void;
  http: (message: string, meta?: any) => void;
  debug: (message: string, meta?: any) => void;
}
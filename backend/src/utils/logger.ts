import winston from 'winston';
import { envConfig } from '../config/config';

const { combine, timestamp, colorize, printf, json, errors } = winston.format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${stack ?? message}${metaStr}`;
  })
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    silent: envConfig.nodeEnv === 'test',
  }),
];

if (envConfig.nodeEnv === 'production') {
  transports.push(
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

export const logger = winston.createLogger({
  level: envConfig.nodeEnv === 'production' ? 'info' : 'debug',
  format: envConfig.nodeEnv === 'production' ? prodFormat : devFormat,
  transports,
});

// Stream for morgan HTTP request logging
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trimEnd());
  },
};

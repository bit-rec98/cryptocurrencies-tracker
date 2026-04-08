import rateLimit from 'express-rate-limit';
import { envConfig } from '../config/config';

export const apiLimiter = rateLimit({
  windowMs: envConfig.rateLimitWindowMs,
  max: envConfig.rateLimitMax,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests for this endpoint, please try again later.'
  }
});
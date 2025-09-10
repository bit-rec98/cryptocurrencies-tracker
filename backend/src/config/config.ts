import dotenv from 'dotenv';

dotenv.config();

export const envConfig = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  coinGeckoApiUrl: process.env.COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
  coinGeckoApiKey: process.env.COINGECKO_API_KEY, // Optional for free tier
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:4200',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
};
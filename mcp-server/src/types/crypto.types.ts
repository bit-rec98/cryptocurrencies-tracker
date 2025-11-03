import { z } from 'zod';

// Zod schemas for runtime validation
export const CryptocurrencySchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.string(),
  current_price: z.number(),
  market_cap: z.number(),
  market_cap_rank: z.number(),
  price_change_percentage_24h: z.number(),
  price_change_24h: z.number(),
  total_volume: z.number(),
  high_24h: z.number(),
  low_24h: z.number(),
  last_updated: z.string(),
});

export const CryptocurrencyDetailsSchema = CryptocurrencySchema.extend({
  description: z.object({
    en: z.string(),
  }).optional(),
  links: z.object({
    homepage: z.array(z.string()),
    blockchain_site: z.array(z.string()),
  }).optional(),
  market_data: z.object({
    current_price: z.record(z.number()),
    market_cap: z.record(z.number()),
    total_volume: z.record(z.number()),
  }).optional(),
});

export const PriceHistorySchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])),
  market_caps: z.array(z.tuple([z.number(), z.number()])),
  total_volumes: z.array(z.tuple([z.number(), z.number()])),
});

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  message: z.string().optional(),
});

export const PaginatedResponseSchema = ApiResponseSchema.extend({
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
  }).optional(),
});

// TypeScript types
export type Cryptocurrency = z.infer<typeof CryptocurrencySchema>;
export type CryptocurrencyDetails = z.infer<typeof CryptocurrencyDetailsSchema>;
export type PriceHistory = z.infer<typeof PriceHistorySchema>;
export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
export type PaginatedResponse<T> = ApiResponse<T> & {
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
};
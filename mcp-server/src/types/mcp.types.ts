import { z } from 'zod';

// MCP Tool argument schemas
export const GetTopCryptosArgsSchema = z.object({
  page: z.number().min(1).default(1).optional(),
  limit: z.number().min(1).max(250).default(50).optional(),
  currency: z.enum(['usd', 'eur', 'btc', 'eth', 'gbp', 'jpy', 'cad', 'aud']).default('usd').optional(),
});

export const GetCryptoDetailsArgsSchema = z.object({
  id: z.string().min(1),
  currency: z.enum(['usd', 'eur', 'btc', 'eth', 'gbp', 'jpy', 'cad', 'aud']).default('usd').optional(),
});

export const GetCryptoChartArgsSchema = z.object({
  id: z.string().min(1),
  // Fix: Use z.number() with refinement instead of z.enum() for numbers
  days: z.number().refine(
    (val) => [1, 7, 14, 30, 90, 180, 365].includes(val),
    {
      message: "Days must be one of: 1, 7, 14, 30, 90, 180, 365"
    }
  ).default(7).optional(),
  currency: z.enum(['usd', 'eur', 'btc', 'eth', 'gbp', 'jpy', 'cad', 'aud']).default('usd').optional(),
});

export const SearchCryptosArgsSchema = z.object({
  query: z.string().min(2),
});

// TypeScript types
export type GetTopCryptosArgs = z.infer<typeof GetTopCryptosArgsSchema>;
export type GetCryptoDetailsArgs = z.infer<typeof GetCryptoDetailsArgsSchema>;
export type GetCryptoChartArgs = z.infer<typeof GetCryptoChartArgsSchema>;
export type SearchCryptosArgs = z.infer<typeof SearchCryptosArgsSchema>;
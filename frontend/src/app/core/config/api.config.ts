import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiBaseUrl;

export const SUPPORTED_CURRENCIES = ['usd', 'eur', 'btc', 'eth', 'gbp', 'jpy', 'cad', 'aud'] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const CHART_DAYS = [1, 7, 14, 30, 90, 180, 365] as const;
export type ChartDays = (typeof CHART_DAYS)[number];

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  usd: '$',
  eur: '€',
  btc: '₿',
  eth: 'Ξ',
  gbp: '£',
  jpy: '¥',
  cad: 'CA$',
  aud: 'A$',
};

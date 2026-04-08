import { Pipe, PipeTransform } from '@angular/core';
import { CURRENCY_SYMBOLS, Currency } from '../../core/config/api.config';

/**
 * Strategy pattern: each currency has its own formatting strategy.
 * Applies smart decimal precision based on the price magnitude.
 */
@Pipe({ name: 'cryptoPrice', standalone: true })
export class CryptoPricePipe implements PipeTransform {
  transform(value: number | null | undefined, currency: Currency = 'usd'): string {
    if (value == null || isNaN(value)) return '—';

    const symbol = CURRENCY_SYMBOLS[currency] ?? currency.toUpperCase();
    const formatted = this.formatValue(value, currency);

    return `${symbol}${formatted}`;
  }

  private formatValue(value: number, currency: Currency): string {
    // BTC and ETH show more decimals; fiat currencies use classic rules
    if (currency === 'btc' || currency === 'eth') {
      return value.toFixed(8);
    }

    const abs = Math.abs(value);
    if (abs >= 1_000) return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
    if (abs >= 1) return value.toFixed(2);
    if (abs >= 0.01) return value.toFixed(4);
    if (abs >= 0.0001) return value.toFixed(6);
    return value.toFixed(8);
  }
}

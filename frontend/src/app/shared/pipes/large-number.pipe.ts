import { Pipe, PipeTransform } from '@angular/core';

/**
 * Strategy pattern: selects the appropriate format based on the magnitude of the number.
 */
@Pipe({ name: 'largeNumber', standalone: true })
export class LargeNumberPipe implements PipeTransform {
  transform(value: number | null | undefined, decimals = 2): string {
    if (value == null || isNaN(value)) return '—';

    const abs = Math.abs(value);

    if (abs >= 1_000_000_000_000) {
      return `${(value / 1_000_000_000_000).toFixed(decimals)}T`;
    }
    if (abs >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(decimals)}B`;
    }
    if (abs >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(decimals)}M`;
    }
    if (abs >= 1_000) {
      return `${(value / 1_000).toFixed(decimals)}K`;
    }

    return value.toFixed(decimals);
  }
}

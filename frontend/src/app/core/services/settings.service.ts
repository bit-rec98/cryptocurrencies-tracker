import { Injectable, signal, computed } from '@angular/core';
import { Currency, SUPPORTED_CURRENCIES } from '../config/api.config';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly _currency = signal<Currency>('usd');

  readonly currency = this._currency.asReadonly();

  readonly supportedCurrencies = SUPPORTED_CURRENCIES;

  setCurrency(currency: Currency): void {
    this._currency.set(currency);
  }
}

import { Injectable, inject, signal, computed } from '@angular/core';
import { Subject, debounceTime, distinctUntilChanged, switchMap, EMPTY } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CryptocurrencyRepository } from '../repositories/cryptocurrency.repository';
import { SettingsService } from '../services/settings.service';
import { ChartDays } from '../config/api.config';
import {
  Cryptocurrency,
  CryptocurrencyDetails,
  Pagination,
  PriceHistory,
  SearchResult,
  TrendingCoin,
} from '../models/cryptocurrency.model';

@Injectable({ providedIn: 'root' })
export class CryptocurrencyFacade {
  private readonly repository = inject(CryptocurrencyRepository);
  readonly settings = inject(SettingsService);

  // ── Market state ──────────────────────────────────────────────
  private readonly _cryptocurrencies = signal<Cryptocurrency[]>([]);
  private readonly _marketLoading = signal(false);
  private readonly _marketError = signal<string | null>(null);
  private readonly _pagination = signal<Pagination>({ page: 1, limit: 50, total: 0 });
  private _lastMarketFetchMs = 0;
  private _lastMarketPage = 0;
  private _lastMarketLimit = 0;
  private readonly MARKET_CACHE_TTL_MS = 60_000; // 1 minute

  readonly cryptocurrencies = this._cryptocurrencies.asReadonly();
  readonly marketLoading = this._marketLoading.asReadonly();
  readonly marketError = this._marketError.asReadonly();
  readonly pagination = this._pagination.asReadonly();

  // ── Trending state ─────────────────────────────────────────────
  private readonly _trending = signal<TrendingCoin[]>([]);
  private readonly _trendingLoading = signal(false);

  readonly trending = this._trending.asReadonly();
  readonly trendingLoading = this._trendingLoading.asReadonly();

  // ── Coin detail state ──────────────────────────────────────────
  private readonly _selectedCoin = signal<CryptocurrencyDetails | null>(null);
  private readonly _detailLoading = signal(false);
  private readonly _detailError = signal<string | null>(null);

  readonly selectedCoin = this._selectedCoin.asReadonly();
  readonly detailLoading = this._detailLoading.asReadonly();
  readonly detailError = this._detailError.asReadonly();

  // ── Chart state ────────────────────────────────────────────────
  private readonly _priceHistory = signal<PriceHistory | null>(null);
  private readonly _chartLoading = signal(false);
  private readonly _selectedDays = signal<ChartDays>(7);

  readonly priceHistory = this._priceHistory.asReadonly();
  readonly chartLoading = this._chartLoading.asReadonly();
  readonly selectedDays = this._selectedDays.asReadonly();

  // ── Search state ───────────────────────────────────────────────
  private readonly _searchResults = signal<SearchResult[]>([]);
  private readonly _searchLoading = signal(false);
  private readonly _searchQuery = signal('');
  private readonly searchSubject = new Subject<string>();

  readonly searchResults = this._searchResults.asReadonly();
  readonly searchLoading = this._searchLoading.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();

  constructor() {
    // Debounced search stream
    this.searchSubject
      .pipe(
        debounceTime(350),
        distinctUntilChanged(),
        switchMap((query) => {
          if (query.length < 2) {
            this._searchResults.set([]);
            this._searchLoading.set(false);
            return EMPTY;
          }
          this._searchLoading.set(true);
          return this.repository.searchCryptocurrencies(query);
        }),
        takeUntilDestroyed()
      )
      .subscribe({
        next: (response) => {
          this._searchResults.set(response.data ?? []);
          this._searchLoading.set(false);
        },
        error: () => {
          this._searchResults.set([]);
          this._searchLoading.set(false);
        },
      });
  }

  // ── Actions ────────────────────────────────────────────────────

  loadMarket(page = 1, limit = 50): void {
    const now = Date.now();
    const isCacheValid =
      this._cryptocurrencies().length > 0 &&
      now - this._lastMarketFetchMs < this.MARKET_CACHE_TTL_MS &&
      this._lastMarketPage === page &&
      this._lastMarketLimit === limit;

    if (isCacheValid) return;

    this._marketLoading.set(true);
    this._marketError.set(null);

    this.repository
      .getTopCryptocurrencies({ page, limit, currency: this.settings.currency() })
      .subscribe({
        next: (response) => {
          this._cryptocurrencies.set(response.data);
          this._pagination.set(response.pagination);
          this._lastMarketFetchMs = Date.now();
          this._lastMarketPage = page;
          this._lastMarketLimit = limit;
          this._marketLoading.set(false);
        },
        error: (err) => {
          this._marketError.set(err.message ?? 'Failed to load market data');
          this._marketLoading.set(false);
        },
      });
  }

  loadTrending(): void {
    this._trendingLoading.set(true);

    this.repository.getTrendingCryptocurrencies().subscribe({
      next: (response) => {
        this._trending.set(response.data?.coins ?? []);
        this._trendingLoading.set(false);
      },
      error: () => {
        this._trendingLoading.set(false);
      },
    });
  }

  loadCoinDetails(id: string): void {
    this._detailLoading.set(true);
    this._detailError.set(null);
    this._selectedCoin.set(null);

    this.repository.getCryptocurrencyById(id, this.settings.currency()).subscribe({
      next: (response) => {
        this._selectedCoin.set(response.data);
        this._detailLoading.set(false);
      },
      error: (err) => {
        this._detailError.set(err.message ?? 'Failed to load coin details');
        this._detailLoading.set(false);
      },
    });
  }

  loadCoinChart(id: string, days: ChartDays = 7): void {
    this._chartLoading.set(true);
    this._selectedDays.set(days);

    this.repository.getCryptocurrencyChart(id, days, this.settings.currency()).subscribe({
      next: (response) => {
        this._priceHistory.set(response.data);
        this._chartLoading.set(false);
      },
      error: () => {
        this._chartLoading.set(false);
      },
    });
  }

  search(query: string): void {
    this._searchQuery.set(query);
    this.searchSubject.next(query);
  }

  clearSearch(): void {
    this._searchQuery.set('');
    this._searchResults.set([]);
  }

  clearCoinDetail(): void {
    this._selectedCoin.set(null);
    this._priceHistory.set(null);
  }
}

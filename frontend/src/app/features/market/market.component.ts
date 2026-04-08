import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CryptocurrencyFacade } from '../../core/facades/cryptocurrency.facade';
import { PriceBadgeComponent } from '../../shared/components/price-badge/price-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { CryptoPricePipe } from '../../shared/pipes/crypto-price.pipe';
import { LargeNumberPipe } from '../../shared/pipes/large-number.pipe';
import { Cryptocurrency } from '../../core/models/cryptocurrency.model';

type SortField = 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'market_cap' | 'total_volume';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    PriceBadgeComponent,
    LoadingSpinnerComponent,
    CryptoPricePipe,
    LargeNumberPipe,
  ],
  templateUrl: './market.component.html',
  styleUrl: './market.component.scss',
})
export class MarketComponent implements OnInit {
  readonly facade = inject(CryptocurrencyFacade);

  readonly currency = this.facade.settings.currency;
  readonly loading = this.facade.marketLoading;
  readonly error = this.facade.marketError;
  readonly pagination = this.facade.pagination;

  filterQuery = signal('');
  sortField = signal<SortField>('market_cap_rank');
  sortDir = signal<SortDir>('asc');

  readonly filteredCoins = computed(() => {
    const coins = this.facade.cryptocurrencies();
    const q = this.filterQuery().toLowerCase().trim();

    let filtered = q
      ? coins.filter(
          (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
        )
      : coins;

    const field = this.sortField();
    const dir = this.sortDir();

    return [...filtered].sort((a, b) => {
      const av = a[field] ?? 0;
      const bv = b[field] ?? 0;
      return dir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  });

  ngOnInit(): void {
    this.facade.loadMarket(1, 50);
  }

  sort(field: SortField): void {
    if (this.sortField() === field) {
      this.sortDir.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDir.set(field === 'market_cap_rank' ? 'asc' : 'desc');
    }
  }

  sortIcon(field: SortField): string {
    if (this.sortField() !== field) return '↕';
    return this.sortDir() === 'asc' ? '↑' : '↓';
  }

  goToPage(page: number): void {
    this.facade.loadMarket(page, this.pagination().limit);
  }

  get totalPages(): number {
    const p = this.pagination();
    return Math.ceil(p.total / p.limit) || 1;
  }
}

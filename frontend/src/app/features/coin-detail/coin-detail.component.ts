import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CryptocurrencyFacade } from '../../core/facades/cryptocurrency.facade';
import { PriceBadgeComponent } from '../../shared/components/price-badge/price-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { CryptoPricePipe } from '../../shared/pipes/crypto-price.pipe';
import { LargeNumberPipe } from '../../shared/pipes/large-number.pipe';
import { PriceChartComponent } from './components/price-chart/price-chart.component';
import { CHART_DAYS, ChartDays } from '../../core/config/api.config';

@Component({
  selector: 'app-coin-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PriceBadgeComponent,
    LoadingSpinnerComponent,
    CryptoPricePipe,
    LargeNumberPipe,
    PriceChartComponent,
  ],
  templateUrl: './coin-detail.component.html',
  styleUrl: './coin-detail.component.scss',
})
export class CoinDetailComponent implements OnInit, OnDestroy {
  readonly facade = inject(CryptocurrencyFacade);
  private readonly route = inject(ActivatedRoute);

  readonly coin = this.facade.selectedCoin;
  readonly loading = this.facade.detailLoading;
  readonly error = this.facade.detailError;
  readonly priceHistory = this.facade.priceHistory;
  readonly chartLoading = this.facade.chartLoading;
  readonly selectedDays = this.facade.selectedDays;
  readonly currency = this.facade.settings.currency;
  readonly chartDays = CHART_DAYS;

  descriptionExpanded = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.facade.loadCoinDetails(id);
    this.facade.loadCoinChart(id, 7);
  }

  ngOnDestroy(): void {
    this.facade.clearCoinDetail();
  }

  changeChartRange(days: ChartDays): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.facade.loadCoinChart(id, days);
  }

  get descriptionText(): string {
    const raw = this.coin()?.description?.en ?? '';
    // Strip HTML tags from description
    return raw.replace(/<[^>]+>/g, '');
  }

  get truncatedDescription(): string {
    const text = this.descriptionText;
    if (!text || this.descriptionExpanded) return text;
    return text.length > 300 ? text.slice(0, 300) + '...' : text;
  }

  filterLinks(links: string[]): string[] {
    return (links ?? []).filter((l) => l && l.trim() !== '');
  }
}

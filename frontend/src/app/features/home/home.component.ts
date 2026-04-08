import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CryptocurrencyFacade } from '../../core/facades/cryptocurrency.facade';
import { PriceBadgeComponent } from '../../shared/components/price-badge/price-badge.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { CryptoPricePipe } from '../../shared/pipes/crypto-price.pipe';
import { LargeNumberPipe } from '../../shared/pipes/large-number.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PriceBadgeComponent,
    LoadingSpinnerComponent,
    CryptoPricePipe,
    LargeNumberPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  readonly facade = inject(CryptocurrencyFacade);

  readonly currency = this.facade.settings.currency;
  readonly trending = this.facade.trending;
  readonly trendingLoading = this.facade.trendingLoading;
  readonly topCoins = this.facade.cryptocurrencies;
  readonly marketLoading = this.facade.marketLoading;

  ngOnInit(): void {
    this.facade.loadTrending();
    this.facade.loadMarket(1, 10);
  }
}

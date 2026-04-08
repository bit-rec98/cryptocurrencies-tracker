import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CryptocurrencyService } from '../../services/cryptocurrency.service';
import { Cryptocurrency } from '../../models/cryptocurrency.model';

@Component({
  selector: 'app-crypto-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crypto-list.component.html',
  styleUrls: ['./crypto-list.component.scss']
})
export class CryptoListComponent implements OnInit, OnDestroy {
  cryptocurrencies: Cryptocurrency[] = [];
  loading = false;
  error: string | null = null;

  // Pagination
  currentPage = 1;
  pageSize = 50;

  // Search
  searchControl = new FormControl('');

  // Currency selection
  selectedCurrency = 'usd';
  supportedCurrencies = ['usd', 'eur', 'btc', 'eth', 'gbp', 'jpy'];

  private destroy$ = new Subject<void>();

  constructor(private cryptoService: CryptocurrencyService) {}

  ngOnInit(): void {
    this.loadCryptocurrencies();
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        if (searchTerm && searchTerm.length >= 2) {
          this.searchCryptocurrencies(searchTerm);
        } else {
          this.loadCryptocurrencies();
        }
      });
  }

  loadCryptocurrencies(): void {
    this.loading = true;
    this.error = null;

    this.cryptoService.getTopCryptocurrencies(this.currentPage, this.pageSize, this.selectedCurrency)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cryptocurrencies = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Failed to load cryptocurrencies';
          this.loading = false;
          console.error('Error loading cryptocurrencies:', error);
        }
      });
  }

  searchCryptocurrencies(query: string): void {
    this.loading = true;
    this.error = null;

    this.cryptoService.searchCryptocurrencies(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.cryptocurrencies = data;
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Search failed';
          this.loading = false;
          console.error('Error searching cryptocurrencies:', error);
        }
      });
  }

  onCurrencyChange(currency: string): void {
    this.selectedCurrency = currency;
    this.loadCryptocurrencies();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCryptocurrencies();
  }

  trackByCryptoId(index: number, crypto: Cryptocurrency): string {
    return crypto.id;
  }
}

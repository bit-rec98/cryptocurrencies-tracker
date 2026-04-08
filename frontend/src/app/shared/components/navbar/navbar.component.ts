import {
  Component,
  inject,
  signal,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CryptocurrencyFacade } from '../../../core/facades/cryptocurrency.facade';
import { SUPPORTED_CURRENCIES, Currency } from '../../../core/config/api.config';
import { SearchResult } from '../../../core/models/cryptocurrency.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private readonly facade = inject(CryptocurrencyFacade);
  private readonly router = inject(Router);
  private readonly elRef = inject(ElementRef);

  readonly searchResults = this.facade.searchResults;
  readonly searchLoading = this.facade.searchLoading;
  readonly currency = this.facade.settings.currency;
  readonly currencies = SUPPORTED_CURRENCIES;

  readonly showDropdown = signal(false);
  readonly mobileMenuOpen = signal(false);
  searchQuery = '';

  onSearch(query: string): void {
    this.facade.search(query);
    this.showDropdown.set(query.length >= 2);
  }

  selectCoin(coin: SearchResult): void {
    this.showDropdown.set(false);
    this.searchQuery = '';
    this.facade.clearSearch();
    this.router.navigate(['/coin', coin.id]);
  }

  changeCurrency(currency: string): void {
    this.facade.settings.setCurrency(currency as Currency);
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.showDropdown.set(false);
    }
  }
}

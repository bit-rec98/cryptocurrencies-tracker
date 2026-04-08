import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'market',
    loadComponent: () =>
      import('./features/market/market.component').then((m) => m.MarketComponent),
  },
  {
    path: 'coin/:id',
    loadComponent: () =>
      import('./features/coin-detail/coin-detail.component').then(
        (m) => m.CoinDetailComponent
      ),
  },
  { path: '**', redirectTo: '' },
];

import { Observable } from 'rxjs';
import {
  ApiResponse,
  Cryptocurrency,
  CryptocurrencyDetails,
  PaginatedResponse,
  PriceHistory,
  SearchResult,
  TrendingResponse,
} from '../models/cryptocurrency.model';
import { Currency, ChartDays } from '../config/api.config';

export interface MarketParams {
  page: number;
  limit: number;
  currency: Currency;
}

export interface ICryptocurrencyRepository {
  getTopCryptocurrencies(params: MarketParams): Observable<PaginatedResponse<Cryptocurrency[]>>;
  getCryptocurrencyById(id: string, currency: Currency): Observable<ApiResponse<CryptocurrencyDetails>>;
  getCryptocurrencyChart(id: string, days: ChartDays, currency: Currency): Observable<ApiResponse<PriceHistory>>;
  searchCryptocurrencies(query: string): Observable<ApiResponse<SearchResult[]>>;
  getTrendingCryptocurrencies(): Observable<ApiResponse<TrendingResponse>>;
}

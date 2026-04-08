import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { Currency, ChartDays } from '../config/api.config';
import { ICryptocurrencyRepository, MarketParams } from '../interfaces/icryptocurrency-repository.interface';
import {
  ApiResponse,
  Cryptocurrency,
  CryptocurrencyDetails,
  PaginatedResponse,
  PriceHistory,
  SearchResult,
  TrendingResponse,
} from '../models/cryptocurrency.model';

@Injectable({ providedIn: 'root' })
export class CryptocurrencyRepository implements ICryptocurrencyRepository {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_BASE_URL}/cryptocurrencies`;

  getTopCryptocurrencies(params: MarketParams): Observable<PaginatedResponse<Cryptocurrency[]>> {
    const httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('limit', params.limit.toString())
      .set('currency', params.currency);

    return this.http.get<PaginatedResponse<Cryptocurrency[]>>(this.baseUrl, { params: httpParams });
  }

  getCryptocurrencyById(id: string, currency: Currency): Observable<ApiResponse<CryptocurrencyDetails>> {
    const httpParams = new HttpParams().set('currency', currency);
    return this.http.get<ApiResponse<CryptocurrencyDetails>>(`${this.baseUrl}/${id}`, { params: httpParams });
  }

  getCryptocurrencyChart(id: string, days: ChartDays, currency: Currency): Observable<ApiResponse<PriceHistory>> {
    const httpParams = new HttpParams()
      .set('days', days.toString())
      .set('currency', currency);

    return this.http.get<ApiResponse<PriceHistory>>(`${this.baseUrl}/${id}/chart`, { params: httpParams });
  }

  searchCryptocurrencies(query: string): Observable<ApiResponse<SearchResult[]>> {
    const httpParams = new HttpParams().set('q', query);
    return this.http.get<ApiResponse<SearchResult[]>>(`${this.baseUrl}/search`, { params: httpParams });
  }

  getTrendingCryptocurrencies(): Observable<ApiResponse<TrendingResponse>> {
    return this.http.get<ApiResponse<TrendingResponse>>(`${this.baseUrl}/trending`);
  }
}

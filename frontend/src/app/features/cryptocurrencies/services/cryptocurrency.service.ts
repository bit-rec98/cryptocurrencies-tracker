import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { Cryptocurrency, CryptocurrencyDetails, PriceHistory } from '../models/cryptocurrency.model';
import { PaginatedResponse, ApiResponse } from '../../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CryptocurrencyService {
  private readonly endpoint = '/api/v1/cryptocurrencies';

  constructor(private apiService: ApiService) {}

  getTopCryptocurrencies(page: number = 1, limit: number = 50, currency: string = 'usd'): Observable<Cryptocurrency[]> {
    return this.apiService.get<PaginatedResponse<Cryptocurrency[]>>(`${this.endpoint}`, {
      page,
      limit,
      currency
    }).pipe(
      map(response => response.data)
    );
  }

  getCryptocurrencyDetails(id: string, currency: string = 'usd'): Observable<CryptocurrencyDetails> {
    return this.apiService.get<ApiResponse<CryptocurrencyDetails>>(`${this.endpoint}/${id}`, {
      currency
    }).pipe(
      map(response => response.data)
    );
  }

  getCryptocurrencyChart(id: string, days: number = 7, currency: string = 'usd'): Observable<PriceHistory> {
    return this.apiService.get<ApiResponse<PriceHistory>>(`${this.endpoint}/${id}/chart`, {
      days,
      currency
    }).pipe(
      map(response => response.data)
    );
  }

  searchCryptocurrencies(query: string): Observable<any[]> {
    return this.apiService.get<ApiResponse<any[]>>(`${this.endpoint}/search`, {
      q: query
    }).pipe(
      map(response => response.data)
    );
  }

  getTrendingCryptocurrencies(): Observable<any> {
    return this.apiService.get<ApiResponse<any>>(`${this.endpoint}/trending`).pipe(
      map(response => response.data)
    );
  }
}

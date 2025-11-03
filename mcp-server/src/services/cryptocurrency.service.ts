import { HttpClientService } from './http-client.service.js';
import {
  Cryptocurrency,
  CryptocurrencyDetails,
  PriceHistory,
  ApiResponse,
  PaginatedResponse,
  CryptocurrencySchema,
  CryptocurrencyDetailsSchema,
  PriceHistorySchema,
  ApiResponseSchema,
} from '../types/crypto.types.js';
import {
  GetTopCryptosArgs,
  GetCryptoDetailsArgs,
  GetCryptoChartArgs,
  SearchCryptosArgs,
} from '../types/mcp.types.js';

export class CryptocurrencyService {
  constructor(private httpClient: HttpClientService) {}

  async getTopCryptocurrencies(args: GetTopCryptosArgs): Promise<PaginatedResponse<Cryptocurrency[]>> {
    const { page = 1, limit = 50, currency = 'usd' } = args;
    
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      currency,
    });

    const response = await this.httpClient.get<PaginatedResponse<Cryptocurrency[]>>(
      `/cryptocurrencies?${params}`
    );

    // Validate response structure
    const validatedResponse = ApiResponseSchema.parse(response);
    
    // Validate each cryptocurrency in the data array
    if (Array.isArray(validatedResponse.data)) {
      validatedResponse.data.forEach((crypto: any) => CryptocurrencySchema.parse(crypto));
    }

    return response;
  }

  async getCryptocurrencyDetails(args: GetCryptoDetailsArgs): Promise<ApiResponse<CryptocurrencyDetails>> {
    const { id, currency = 'usd' } = args;
    
    const params = new URLSearchParams({ currency });

    const response = await this.httpClient.get<ApiResponse<CryptocurrencyDetails>>(
      `/cryptocurrencies/${id}?${params}`
    );

    // Validate response
    const validatedResponse = ApiResponseSchema.parse(response);
    CryptocurrencyDetailsSchema.parse(validatedResponse.data);

    return response;
  }

  async getCryptocurrencyChart(args: GetCryptoChartArgs): Promise<ApiResponse<PriceHistory>> {
    const { id, days = 7, currency = 'usd' } = args;
    
    const params = new URLSearchParams({
      days: days.toString(),
      currency,
    });

    const response = await this.httpClient.get<ApiResponse<PriceHistory>>(
      `/cryptocurrencies/${id}/chart?${params}`
    );

    // Validate response
    const validatedResponse = ApiResponseSchema.parse(response);
    PriceHistorySchema.parse(validatedResponse.data);

    return response;
  }

  async searchCryptocurrencies(args: SearchCryptosArgs): Promise<ApiResponse<any[]>> {
    const { query } = args;
    
    const params = new URLSearchParams({ q: query });

    const response = await this.httpClient.get<ApiResponse<any[]>>(
      `/cryptocurrencies/search?${params}`
    );

    // Validate response structure
    ApiResponseSchema.parse(response);

    return response;
  }

  async getTrendingCryptocurrencies(): Promise<ApiResponse<any>> {
    const response = await this.httpClient.get<ApiResponse<any>>('/cryptocurrencies/trending');

    // Validate response structure
    ApiResponseSchema.parse(response);

    return response;
  }
}
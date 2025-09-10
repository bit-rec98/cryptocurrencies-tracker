import {
  Cryptocurrency,
  CryptocurrencyDetails,
  PriceHistory,
} from "@/models/cryptocurrency";

export interface ICryptocurrencyService {
  getTopCryptocurrencies(
    page: number,
    limit: number,
    currency: string
  ): Promise<Cryptocurrency[]>;
  getCryptocurrencyDetails(
    id: string,
    currency: string
  ): Promise<CryptocurrencyDetails>;
  getCryptocurrencyChart(
    id: string,
    days: number,
    currency: string
  ): Promise<PriceHistory>;
  searchCryptocurrencies(query: string): Promise<any[]>;
  getTrendingCryptocurrencies(): Promise<any>;
}

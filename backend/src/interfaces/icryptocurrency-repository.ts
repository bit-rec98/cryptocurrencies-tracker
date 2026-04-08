import {
  Cryptocurrency,
  CryptocurrencyDetails,
  PriceHistory,
} from "@/models/cryptocurrency";

export interface ICryptocurrencyRepository {
  getAllCryptocurrencies(
    page: number,
    limit: number,
    currency: string
  ): Promise<Cryptocurrency[]>;
  getCryptocurrencyById(
    id: string,
    currency: string
  ): Promise<CryptocurrencyDetails>;
  getCryptocurrencyPriceHistory(
    id: string,
    days: number,
    currency: string
  ): Promise<PriceHistory>;
  searchCryptocurrencies(query: string): Promise<any[]>;
  getTrendingCryptocurrencies(): Promise<any>;
}

import { ICryptocurrencyRepository } from "@/interfaces/icryptocurrency-repository";
import { IHttpClient } from "@/interfaces/ihttpclient";
import {
  Cryptocurrency,
  CryptocurrencyDetails,
  PriceHistory,
} from "@/models/cryptocurrency";

export class CryptocurrencyRepository implements ICryptocurrencyRepository {
  constructor(private httpClient: IHttpClient) {}

  async getAllCryptocurrencies(
    page: number = 1,
    limit: number = 50,
    currency: string = "usd"
  ): Promise<Cryptocurrency[]> {
    const url = `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=${page}&sparkline=false&price_change_percentage=24h`;
    return await this.httpClient.get<Cryptocurrency[]>(url);
  }

  async getCryptocurrencyById(
    id: string,
    currency: string = "usd"
  ): Promise<CryptocurrencyDetails> {
    const url = `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    return await this.httpClient.get<CryptocurrencyDetails>(url);
  }

  async getCryptocurrencyPriceHistory(
    id: string,
    days: number = 7,
    currency: string = "usd"
  ): Promise<PriceHistory> {
    const url = `/coins/${id}/market_chart?vs_currency=${currency}&days=${days}&interval=${
      days <= 1 ? "hourly" : "daily"
    }`;
    return await this.httpClient.get<PriceHistory>(url);
  }

  async searchCryptocurrencies(query: string): Promise<any[]> {
    const url = `/search?query=${encodeURIComponent(query)}`;
    const response = await this.httpClient.get<{ coins: any[] }>(url);
    return response.coins;
  }

  async getTrendingCryptocurrencies(): Promise<any> {
    const url = "/search/trending";
    return await this.httpClient.get(url);
  }
}

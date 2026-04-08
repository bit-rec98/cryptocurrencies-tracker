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
    const raw = await this.httpClient.get<any>(url);
    const md = raw.market_data ?? {};
    const cur = currency.toLowerCase();

    return {
      id: raw.id,
      symbol: raw.symbol,
      name: raw.name,
      image: raw.image?.large ?? raw.image?.small ?? raw.image?.thumb ?? "",
      market_cap_rank: raw.market_cap_rank,
      last_updated: raw.last_updated,
      description: raw.description,
      links: raw.links,
      // Flatten market_data fields from currency-keyed objects
      current_price: md.current_price?.[cur] ?? 0,
      market_cap: md.market_cap?.[cur] ?? 0,
      fully_diluted_valuation: md.fully_diluted_valuation?.[cur] ?? null,
      total_volume: md.total_volume?.[cur] ?? 0,
      high_24h: md.high_24h?.[cur] ?? 0,
      low_24h: md.low_24h?.[cur] ?? 0,
      ath: md.ath?.[cur] ?? 0,
      ath_change_percentage: md.ath_change_percentage?.[cur] ?? 0,
      ath_date: md.ath_date?.[cur] ?? "",
      atl: md.atl?.[cur] ?? 0,
      atl_change_percentage: md.atl_change_percentage?.[cur] ?? 0,
      atl_date: md.atl_date?.[cur] ?? "",
      // These come as plain numbers (not currency-keyed)
      price_change_24h: md.price_change_24h ?? 0,
      price_change_percentage_24h: md.price_change_percentage_24h ?? 0,
      market_cap_change_24h: md.market_cap_change_24h ?? 0,
      market_cap_change_percentage_24h: md.market_cap_change_percentage_24h ?? 0,
      circulating_supply: md.circulating_supply ?? 0,
      total_supply: md.total_supply ?? null,
      max_supply: md.max_supply ?? null,
    };
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

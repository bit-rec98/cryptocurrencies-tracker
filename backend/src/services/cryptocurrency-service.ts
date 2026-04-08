import { ICryptocurrencyRepository } from "@/interfaces/icryptocurrency-repository";
import { ICryptocurrencyService } from "@/interfaces/icryptocurrency-service";
import {
  Cryptocurrency,
  CryptocurrencyDetails,
  PriceHistory,
} from "@/models/cryptocurrency";
import { logger } from "@/utils/logger";

export class CryptocurrencyService implements ICryptocurrencyService {
  constructor(private cryptocurrencyRepository: ICryptocurrencyRepository) {}

  async getTopCryptocurrencies(
    page: number = 1,
    limit: number = 50,
    currency: string = "usd"
  ): Promise<Cryptocurrency[]> {
    logger.debug("getTopCryptocurrencies", { page, limit, currency });
    this.validatePagination(page, limit);
    this.validateCurrency(currency);

    const result = await this.cryptocurrencyRepository.getAllCryptocurrencies(page, limit, currency);
    logger.info(`Fetched ${result.length} cryptocurrencies`, { page, limit, currency });
    return result;
  }

  async getCryptocurrencyDetails(
    id: string,
    currency: string = "usd"
  ): Promise<CryptocurrencyDetails> {
    logger.debug("getCryptocurrencyDetails", { id, currency });
    this.validateId(id);
    this.validateCurrency(currency);

    const result = await this.cryptocurrencyRepository.getCryptocurrencyById(id, currency);
    logger.info(`Fetched details for cryptocurrency`, { id, currency });
    return result;
  }

  async getCryptocurrencyChart(
    id: string,
    days: number = 7,
    currency: string = "usd"
  ): Promise<PriceHistory> {
    logger.debug("getCryptocurrencyChart", { id, days, currency });
    this.validateId(id);
    this.validateDays(days);
    this.validateCurrency(currency);

    const result = await this.cryptocurrencyRepository.getCryptocurrencyPriceHistory(id, days, currency);
    logger.info(`Fetched price history`, { id, days, currency });
    return result;
  }

  async searchCryptocurrencies(query: string): Promise<any[]> {
    logger.debug("searchCryptocurrencies", { query });
    this.validateSearchQuery(query);

    const result = await this.cryptocurrencyRepository.searchCryptocurrencies(query);
    logger.info(`Search returned ${result.length} results`, { query });
    return result;
  }

  async getTrendingCryptocurrencies(): Promise<any> {
    logger.debug("getTrendingCryptocurrencies");
    const result = await this.cryptocurrencyRepository.getTrendingCryptocurrencies();
    logger.info("Fetched trending cryptocurrencies");
    return result;
  }

  private validatePagination(page: number, limit: number): void {
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1 || limit > 250)
      throw new Error("Limit must be between 1 and 250");
  }

  private validateCurrency(currency: string): void {
    const supportedCurrencies = [
      "usd",
      "eur",
      "btc",
      "eth",
      "gbp",
      "jpy",
      "cad",
      "aud",
    ];
    if (!supportedCurrencies.includes(currency.toLowerCase())) {
      throw new Error(`Unsupported currency: ${currency}`);
    }
  }

  private validateId(id: string): void {
    if (!id || id.trim().length === 0) {
      throw new Error("Cryptocurrency ID is required");
    }
  }

  private validateDays(days: number): void {
    const allowedDays = [1, 7, 14, 30, 90, 180, 365];
    if (!allowedDays.includes(days)) {
      throw new Error(
        `Unsupported days value: ${days}. Allowed values: ${allowedDays.join(
          ", "
        )}`
      );
    }
  }

  private validateSearchQuery(query: string): void {
    if (!query || query.trim().length < 2) {
      throw new Error("Search query must be at least 2 characters long");
    }
  }
}

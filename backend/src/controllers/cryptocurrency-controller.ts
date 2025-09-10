import { Request, Response, NextFunction } from "express";
import { ICryptocurrencyService } from "../interfaces/icryptocurrency-service";
import { ApiResponse, PaginatedResponse } from "../models/cryptocurrency";

export class CryptocurrencyController {
  constructor(private cryptoService: ICryptocurrencyService) {}

  getTopCryptocurrencies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;
      const currency = String(req.query.currency || "usd");

      const cryptos = await this.cryptoService.getTopCryptocurrencies(
        page,
        limit,
        currency
      );

      const response: PaginatedResponse<typeof cryptos> = {
        success: true,
        data: cryptos,
        pagination: {
          page,
          limit,
          total: cryptos.length, // For a full implementation, you would want to get the total count from the API
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getCryptocurrencyById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;
      const currency = String(req.query.currency || "usd");

      const crypto = await this.cryptoService.getCryptocurrencyDetails(
        id,
        currency
      );

      const response: ApiResponse<typeof crypto> = {
        success: true,
        data: crypto,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getCryptocurrencyChart = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;
      const days = Number(req.query.days || 7);
      const currency = String(req.query.currency || "usd");

      const chartData = await this.cryptoService.getCryptocurrencyChart(
        id,
        days,
        currency
      );

      const response: ApiResponse<typeof chartData> = {
        success: true,
        data: chartData,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  searchCryptocurrencies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const query = String(req.query.q || "");

      const results = await this.cryptoService.searchCryptocurrencies(query);

      const response: ApiResponse<typeof results> = {
        success: true,
        data: results,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };

  getTrendingCryptocurrencies = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const trending = await this.cryptoService.getTrendingCryptocurrencies();

      const response: ApiResponse<typeof trending> = {
        success: true,
        data: trending,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
}

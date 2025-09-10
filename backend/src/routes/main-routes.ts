import express from "express";
import { CryptocurrencyController } from "../controllers/cryptocurrency-controller";
import { CryptocurrencyService } from "../services/cryptocurrency-service";
import { CryptocurrencyRepository } from "../repositories/cryptocurrency-repository";
import { HttpClient } from "../utils/http-client";
import { envConfig } from "../config/config";
import { createCryptocurrencyRoutes } from "./cryptocurrencies-routes";

export const setupRoutes = () => {
  const router = express.Router();

  // Setup dependencies
  const httpClient = new HttpClient(envConfig.coinGeckoApiUrl, {
    headers: envConfig.coinGeckoApiKey
      ? { "x-cg-api-key": envConfig.coinGeckoApiKey }
      : {},
  });

  const cryptoRepo = new CryptocurrencyRepository(httpClient);
  const cryptoService = new CryptocurrencyService(cryptoRepo);
  const cryptoController = new CryptocurrencyController(cryptoService);

  // Setup routes
  router.use(
    "/api/v1/cryptocurrencies",
    createCryptocurrencyRoutes(cryptoController)
  );

  return router;
};

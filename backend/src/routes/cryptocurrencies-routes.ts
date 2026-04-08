import express from "express";
import { CryptocurrencyController } from "../controllers/cryptocurrency-controller";
import {
  validateQuery,
  validateParams,
  cryptocurrencySchemas,
} from "../middleware/validations";
import { strictLimiter } from "../middleware/rate-limiter";

export const createCryptocurrencyRoutes = (
  cryptoController: CryptocurrencyController
) => {
  const router = express.Router();

  router.get(
    "/",
    validateQuery(cryptocurrencySchemas.getTopCryptocurrencies),
    cryptoController.getTopCryptocurrencies
  );

  router.get("/trending", cryptoController.getTrendingCryptocurrencies);

  router.get(
    "/search",
    validateQuery(cryptocurrencySchemas.searchCryptocurrencies),
    strictLimiter,
    cryptoController.searchCryptocurrencies
  );

  router.get(
    "/:id",
    validateParams(cryptocurrencySchemas.getCryptocurrencyDetails),
    cryptoController.getCryptocurrencyById
  );

  router.get(
    "/:id/chart",
    validateParams(cryptocurrencySchemas.getCryptocurrencyDetails),
    validateQuery(cryptocurrencySchemas.getCryptocurrencyChart),
    cryptoController.getCryptocurrencyChart
  );

  return router;
};

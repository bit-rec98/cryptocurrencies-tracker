import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
export const cryptocurrencySchemas = {
  getTopCryptocurrencies: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(250).default(50),
    currency: Joi.string().valid('usd', 'eur', 'btc', 'eth', 'gbp', 'jpy', 'cad', 'aud').default('usd')
  }),

  getCryptocurrencyDetails: Joi.object({
    id: Joi.string().required().min(1)
  }),

  getCryptocurrencyChart: Joi.object({
    id: Joi.string().required().min(1),
    days: Joi.number().valid(1, 7, 14, 30, 90, 180, 365).default(7),
    currency: Joi.string().valid('usd', 'eur', 'btc', 'eth', 'gbp', 'jpy', 'cad', 'aud').default('usd')
  }),

  searchCryptocurrencies: Joi.object({
    q: Joi.string().required().min(2)
  })
};
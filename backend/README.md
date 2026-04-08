# Cryptocurrency Tracker API

A Node.js/TypeScript API for tracking cryptocurrency data.

## Available Endpoints

### Cryptocurrency Routes
Based on the [`cryptocurrency-controller.ts`](backend/src/controllers/cryptocurrency-controller.ts) and [`cryptocurrencies-routes.ts`](backend/src/routes/cryptocurrencies-routes.ts):

- `GET /api/cryptocurrencies` - Get list of cryptocurrencies
- `GET /api/cryptocurrencies/:id` - Get specific cryptocurrency by ID
- `POST /api/cryptocurrencies` - Create new cryptocurrency entry
- `PUT /api/cryptocurrencies/:id` - Update cryptocurrency by ID
- `DELETE /api/cryptocurrencies/:id` - Delete cryptocurrency by ID

### Main Routes
Additional routes defined in [`main-routes.ts`](backend/src/routes/main-routes.ts):

- `GET /` - Health check/API status
- `GET /health` - API health endpoint

## Features

- **Error Handling**: Custom error handling middleware ([`error-handler.ts`](backend/src/middleware/error-handler.ts))
- **Rate Limiting**: Request rate limiting ([`rate-limiter.ts`](backend/src/middleware/rate-limiter.ts))
- **Validation**: Input validation middleware ([`validations.ts`](backend/src/middleware/validations.ts))
- **HTTP Client**: Utility for external API calls ([`http-client.ts`](backend/src/utils/http-client.ts))

## Configuration

Configuration is managed through [`config.ts`](backend/src/config/config.ts).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the server:
   ```bash
   npm start
   ```

The server entry point is [`index.ts`](backend/src/index.ts) with the main server configuration in [`server.ts`](backend/src/server.ts).
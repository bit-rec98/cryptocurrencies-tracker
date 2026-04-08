# Cryptocurrencies Tracker

A full-stack cryptocurrency tracking application built with **Node.js/TypeScript** (backend) and **Angular 18** (frontend), consuming the [CoinGecko API](https://www.coingecko.com/en/api).

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [Frontend Routes](#frontend-routes)
- [Architecture](#architecture)

---

## Overview

The application allows users to:

- Browse the top cryptocurrencies by market cap
- View detailed information and price history charts for any coin
- Search for specific cryptocurrencies
- Browse trending coins
- Switch between multiple fiat and crypto currency pairs

---

## Tech Stack

| Layer    | Technology                                      |
|----------|-------------------------------------------------|
| Backend  | Node.js, Express 5, TypeScript, Axios           |
| Frontend | Angular 18, Chart.js, RxJS, SCSS                |
| API      | CoinGecko REST API (free tier compatible)       |
| Security | Helmet, CORS, express-rate-limit, Joi validation|

---

## Project Structure

```
cryptocurrencies-tracker/
├── backend/                  # Express API
│   ├── src/
│   │   ├── config/           # Environment configuration
│   │   ├── controllers/      # Route handlers
│   │   ├── interfaces/       # TypeScript contracts
│   │   ├── middleware/       # Error handler, rate limiter, validation
│   │   ├── models/           # Data models
│   │   ├── repositories/     # Data access layer (CoinGecko)
│   │   ├── routes/           # Express routers
│   │   ├── services/         # Business logic
│   │   └── utils/            # HTTP client wrapper
│   ├── .env                  # Local environment variables (gitignored)
│   ├── .env.example          # Environment variable reference template
│   └── package.json
│
└── frontend/                 # Angular 18 SPA
    ├── src/
    │   ├── app/
    │   │   ├── core/         # Config, facades, interceptors, repositories
    │   │   ├── features/     # Home, Market, Coin Detail pages
    │   │   └── shared/       # Reusable components and pipes
    │   └── environments/     # Per-environment configuration
    │       ├── environment.ts          # Development
    │       └── environment.prod.ts     # Production
    ├── .env.example          # Frontend environment reference
    └── package.json
```

---

## Prerequisites

- **Node.js** 20 or later
- **npm** 10 or later
- **Angular CLI** 18 (`npm install -g @angular/cli@18`)

---

## Environment Setup

### Backend

1. Copy the example file and populate your values:

   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `backend/.env`:

   | Variable                | Default                              | Description                                    |
   |-------------------------|--------------------------------------|------------------------------------------------|
   | `PORT`                  | `3000`                               | Port the Express server listens on             |
   | `NODE_ENV`              | `development`                        | `development` or `production`                  |
   | `COINGECKO_API_URL`     | `https://api.coingecko.com/api/v3`   | CoinGecko base URL                             |
   | `COINGECKO_API_KEY`     | *(empty)*                            | API key — optional for the free tier           |
   | `CORS_ORIGIN`           | `http://localhost:4200`              | Allowed frontend origin                        |
   | `RATE_LIMIT_WINDOW_MS`  | `900000`                             | Rate-limit window in ms (default 15 min)       |
   | `RATE_LIMIT_MAX`        | `100`                                | Max requests per IP per window                 |

### Frontend

The frontend is configured via Angular environment files — no `.env` file is required at runtime.

| File                                  | Used when                          |
|---------------------------------------|------------------------------------|
| `src/environments/environment.ts`     | `ng serve` / development build     |
| `src/environments/environment.prod.ts`| `ng build` / production build      |

Edit `environment.prod.ts` before deploying and set `apiBaseUrl` to your production API URL.

---

## Running the Application

### Backend

```bash
cd backend
npm install
npm run dev        # development (ts-node + nodemon)
# or
npm run build && npm start   # compiled production
```

The API will be available at `http://localhost:3000`.

### Frontend

```bash
cd frontend
npm install
npm start          # ng serve — opens http://localhost:4200
# or
npm run build      # production build → dist/frontend/
```

---

## API Reference

All endpoints are prefixed with `/api/v1`.

| Method | Endpoint                          | Description                                     |
|--------|-----------------------------------|-------------------------------------------------|
| GET    | `/cryptocurrencies`               | Paginated list of top coins by market cap       |
| GET    | `/cryptocurrencies/trending`      | Currently trending coins                        |
| GET    | `/cryptocurrencies/search?q=`     | Search coins by name or symbol                  |
| GET    | `/cryptocurrencies/:id`           | Detailed info for a single coin                 |
| GET    | `/cryptocurrencies/:id/chart`     | Price history (OHLC) for a coin                 |
| GET    | `/health`                         | Server health check                             |

**Common query parameters**

| Parameter  | Type     | Default | Description                     |
|------------|----------|---------|---------------------------------|
| `currency` | `string` | `usd`   | Target currency (usd, eur, btc…)|
| `page`     | `number` | `1`     | Page number                     |
| `limit`    | `number` | `50`    | Results per page                |
| `days`     | `number` | `7`     | Chart history window in days    |

---

## Frontend Routes

| Path         | Component         | Description                     |
|--------------|-------------------|---------------------------------|
| `/`          | `HomeComponent`   | Landing page                    |
| `/market`    | `MarketComponent` | Full market list with pagination|
| `/coin/:id`  | `CoinDetailComponent` | Coin details and price chart|

---

## Architecture

### Backend — Clean Architecture

```
Request → Router → Middleware (validation, rate-limit)
       → Controller → Service → Repository → CoinGecko API
```

- **Controller** handles HTTP concerns only.
- **Service** enforces business rules and validation.
- **Repository** abstracts the CoinGecko HTTP calls.
- **IHttpClient** interface decouples Axios from the rest of the code.

### Frontend — Feature-based with Facade pattern

```
Component → Facade → Repository → HttpClient → Backend API
```

- **Core** holds shared infrastructure (repositories, services, interfaces).
- **Features** are lazily loaded Angular standalone components.
- **Shared** contains reusable UI components and pipes.
- The `ErrorInterceptor` centrally handles HTTP errors from the API.

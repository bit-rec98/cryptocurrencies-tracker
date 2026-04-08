import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { CryptocurrencyService } from '../services/cryptocurrency.service.js';
import {
  GetTopCryptosArgsSchema,
  GetCryptoDetailsArgsSchema,
  GetCryptoChartArgsSchema,
  SearchCryptosArgsSchema,
} from '../types/mcp.types.js';

export class CryptoHandlers {
  constructor(private cryptoService: CryptocurrencyService) {}

  // Define available tools
  getTools(): Tool[] {
    return [
      {
        name: 'get_top_cryptocurrencies',
        description: 'Get top cryptocurrencies by market cap with pagination',
        inputSchema: {
          type: 'object',
          properties: {
            page: {
              type: 'number',
              description: 'Page number (default: 1)',
              minimum: 1,
            },
            limit: {
              type: 'number',
              description: 'Number of items per page (default: 50, max: 250)',
              minimum: 1,
              maximum: 250,
            },
            currency: {
              type: 'string',
              description: 'Currency for price data (default: usd)',
              enum: ['usd', 'eur', 'btc', 'eth', 'gbp', 'jpy', 'cad', 'aud'],
            },
          },
        },
      },
      {
        name: 'get_cryptocurrency_details',
        description: 'Get detailed information about a specific cryptocurrency',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Cryptocurrency identifier (e.g., bitcoin, ethereum)',
            },
            currency: {
              type: 'string',
              description: 'Currency for price data (default: usd)',
              enum: ['usd', 'eur', 'btc', 'eth', 'gbp', 'jpy', 'cad', 'aud'],
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'get_cryptocurrency_chart',
        description: 'Get price chart data for a cryptocurrency',
        inputSchema: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Cryptocurrency identifier (e.g., bitcoin, ethereum)',
            },
            days: {
              type: 'number',
              description: 'Time range in days (default: 7)',
              enum: [1, 7, 14, 30, 90, 180, 365],
            },
            currency: {
              type: 'string',
              description: 'Currency for price data (default: usd)',
              enum: ['usd', 'eur', 'btc', 'eth', 'gbp', 'jpy', 'cad', 'aud'],
            },
          },
          required: ['id'],
        },
      },
      {
        name: 'search_cryptocurrencies',
        description: 'Search for cryptocurrencies by name or symbol',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query (minimum 2 characters)',
              minLength: 2,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_trending_cryptocurrencies',
        description: 'Get currently trending cryptocurrencies',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ];
  }

  // Handle tool calls
  async handleToolCall(name: string, arguments_: any): Promise<any> {
    try {
      switch (name) {
        case 'get_top_cryptocurrencies':
          return await this.handleGetTopCryptocurrencies(arguments_);
        
        case 'get_cryptocurrency_details':
          return await this.handleGetCryptocurrencyDetails(arguments_);
        
        case 'get_cryptocurrency_chart':
          return await this.handleGetCryptocurrencyChart(arguments_);
        
        case 'search_cryptocurrencies':
          return await this.handleSearchCryptocurrencies(arguments_);
        
        case 'get_trending_cryptocurrencies':
          return await this.handleGetTrendingCryptocurrencies();
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      console.error(`Error handling tool call ${name}:`, error);
      throw error;
    }
  }

  private async handleGetTopCryptocurrencies(args: any) {
    const validatedArgs = GetTopCryptosArgsSchema.parse(args);
    const result = await this.cryptoService.getTopCryptocurrencies(validatedArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetCryptocurrencyDetails(args: any) {
    const validatedArgs = GetCryptoDetailsArgsSchema.parse(args);
    const result = await this.cryptoService.getCryptocurrencyDetails(validatedArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetCryptocurrencyChart(args: any) {
    const validatedArgs = GetCryptoChartArgsSchema.parse(args);
    const result = await this.cryptoService.getCryptocurrencyChart(validatedArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleSearchCryptocurrencies(args: any) {
    const validatedArgs = SearchCryptosArgsSchema.parse(args);
    const result = await this.cryptoService.searchCryptocurrencies(validatedArgs);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }

  private async handleGetTrendingCryptocurrencies() {
    const result = await this.cryptoService.getTrendingCryptocurrencies();
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  }
}
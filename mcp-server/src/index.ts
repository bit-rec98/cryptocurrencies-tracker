import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

import { config } from './config/config.js';
import { HttpClientService } from './services/http-client.service.js';
import { CryptocurrencyService } from './services/cryptocurrency.service.js';
import { CryptoHandlers } from './handlers/crypto.handlers.js';

class CryptoTrackerMCPServer {
  private server: Server;
  private cryptoHandlers: CryptoHandlers;

  constructor() {
    // Initialize services
    const httpClient = new HttpClientService();
    const cryptoService = new CryptocurrencyService(httpClient);
    this.cryptoHandlers = new CryptoHandlers(cryptoService);

    // Initialize MCP server
    this.server = new Server(
      {
        name: config.server.name,
        version: config.server.version,
        instructions: config.server.instructions
      },
      {
        capabilities: {
          tools: {},
          prompts: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // Handle list tools requests
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: this.cryptoHandlers.getTools(),
      };
    });

    // Handle list prompts requests (empty for now)
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => {
      return {
        prompts: [],
      };
    });

    // Handle list resources requests (empty for now)
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [],
      };
    });

    // Handle tool call requests
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        const result = await this.cryptoHandlers.handleToolCall(name, args);
        return result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`Tool call error for ${name}:`, error);
        
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error(`${config.server.name} v${config.server.version} started`);
    console.error(`Connected to backend API at: ${config.backend.apiUrl}`);
  }
}

// Start the server
async function main() {
  try {
    const server = new CryptoTrackerMCPServer();
    await server.start();
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.error('Shutting down MCP server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.error('Shutting down MCP server...');
  process.exit(0);
});

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    name: process.env.MCP_SERVER_NAME || 'crypto-tracker-mcp',
    version: process.env.MCP_SERVER_VERSION || '1.0.0',
    instructions: process.env.MCP_SERVER_INSTRUCTIONS || 'You are a cryptocurrency data assistant.',
  },
  backend: {
    apiUrl: process.env.BACKEND_API_URL || 'http://localhost:3000/api/v1',
    timeout: parseInt(process.env.BACKEND_API_TIMEOUT || '10000'),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  nodeEnv: process.env.NODE_ENV || 'development',
};
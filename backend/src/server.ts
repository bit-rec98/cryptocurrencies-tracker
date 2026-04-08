import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { envConfig } from './config/config';
import { setupRoutes } from './routes/main-routes';
import { errorHandler, notFoundHandler } from './middleware/error-handler';
import { apiLimiter } from './middleware/rate-limiter';
import { logger, morganStream } from './utils/logger';

const app = express();

// Middlewares
app.use(cors({
  origin: envConfig.corsOrigin,
  optionsSuccessStatus: 200
}));
app.use(helmet());
app.use(morgan(envConfig.nodeEnv === 'production' ? 'combined' : 'dev', { stream: morganStream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api', apiLimiter);

// Routes
app.use(setupRoutes());

// Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = envConfig.port;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${envConfig.nodeEnv} mode`);
});

export default app;
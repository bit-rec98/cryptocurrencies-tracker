import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Axios/HTTP errors
  if ((err as any).response) {
    statusCode = (err as any).response.status || 500;
    message = (err as any).response.data?.message || message;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};
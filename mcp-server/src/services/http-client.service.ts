import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { config } from '../config/config.js';

export class HttpClientService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.backend.apiUrl,
      timeout: config.backend.timeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (config.url && config.method) {
          console.error(`[HTTP] ${config.method.toUpperCase()} ${config.url}`);
        }
        return config;
      },
      (error) => {
        console.error('[HTTP] Request error:', error.message);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        console.error(`[HTTP] Response ${response.status} from ${response.config.url}`);
        return response;
      },
      (error: AxiosError) => {
        if (error.code === 'ECONNREFUSED') {
          console.error('[HTTP] Connection refused - Backend server may not be running');
          throw new Error('Backend server is not available. Please ensure the backend is running on http://localhost:3000');
        }
        
        console.error('[HTTP] Response error:', error.response?.status, error.response?.statusText || error.message);
        
        // Fix: Check if response exists before checking status
        if (error.response) {
          const status = error.response.status;
          
          if (status === 404) {
            throw new Error('Requested cryptocurrency not found');
          } else if (status === 429) {
            throw new Error('Rate limit exceeded. Please try again later');
          } else if (status >= 500) {
            throw new Error('Backend server error. Please try again later');
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while making GET request');
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while making POST request');
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while making PUT request');
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Unknown error occurred while making DELETE request');
    }
  }
}
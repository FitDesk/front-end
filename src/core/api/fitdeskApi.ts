import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

export interface ApiResponse<T = any> {
  data?: T;
  error?: {
    message: string;
    code?: string | number;
    details?: any;
  };
  status?: number;
}

class FitdeskApiClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    this.initializeResponseInterceptor();
    this.initializeRequestInterceptor();
  }

  private initializeRequestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        //  agregar tokens de autenticación 
        // const token = localStorage.getItem('token');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private initializeResponseInterceptor() {
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { data, status } = error.response;
        
        // Si es un 404 para la ruta de miembros, lo manejamos de manera especial
        if (status === 404 && error.config?.url?.includes('/api/members')) {
          return new Error('NO_MEMBERS_FOUND');
        }
        
        const message = (data as any)?.message || error.message || 'An error occurred';
        return new Error(`[${status}] ${message}`);
      } else if (error.request) {
        return new Error('No response received from server. Please check your connection.');
      }
    }
    return error instanceof Error ? error : new Error('An unknown error occurred');
  }

  public async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }
}

const fitdeskApi = new FitdeskApiClient();
export { fitdeskApi };
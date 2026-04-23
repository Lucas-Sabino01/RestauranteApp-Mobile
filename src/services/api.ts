import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENV } from '../config/env.ts';
import type { ApiError } from '../types';

const api = axios.create({
  baseURL: ENV.API_URL,
  timeout: ENV.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await SecureStore.getItemAsync(ENV.STORAGE_KEYS.AUTH_TOKEN);
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token!);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(ENV.STORAGE_KEYS.REFRESH_TOKEN);

        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${ENV.API_URL}/auth/refresh`, {
          refreshToken,
        });

        const newToken = data.token;
        await SecureStore.setItemAsync(ENV.STORAGE_KEYS.AUTH_TOKEN, newToken);

        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        await SecureStore.deleteItemAsync(ENV.STORAGE_KEYS.AUTH_TOKEN);
        await SecureStore.deleteItemAsync(ENV.STORAGE_KEYS.REFRESH_TOKEN);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;

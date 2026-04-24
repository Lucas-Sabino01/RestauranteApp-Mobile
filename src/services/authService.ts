import api from './api';
import * as SecureStore from 'expo-secure-store';
import { ENV } from '../config/env';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  Usuario,
} from '../types';
import { USUARIO_MOCK } from '../data/mock';

const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials);
    return data;
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string }> => {
    const { data } = await api.post('/auth/refresh', { refreshToken });
    return data;
  },

  logout: async (): Promise<void> => {
    await api.delete('/auth/logout');
  },
};

const authMock = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (!credentials.email.includes('@')) {
      throw new Error('Email inválido');
    }
    return {
      token: 'mock_jwt_token_123',
      refreshToken: 'mock_refresh_token_456',
      user: { ...USUARIO_MOCK, email: credentials.email },
    };
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (!payload.email.includes('@') || payload.nome.length === 0) {
      throw new Error('Dados inválidos');
    }
    return {
      token: 'mock_jwt_token_123',
      refreshToken: 'mock_refresh_token_456',
      user: { ...USUARIO_MOCK, nome: payload.nome, email: payload.email },
    };
  },

  refreshToken: async (): Promise<{ token: string }> => ({
    token: 'mock_jwt_token_refreshed',
  }),

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
  },
};

const service = ENV.USE_MOCKS ? authMock : authApi;

export const authService = {
  login: async (credentials: LoginRequest): Promise<{ user: Usuario }> => {
    const response = await service.login(credentials);
    if (!ENV.USE_MOCKS) {
      await SecureStore.setItemAsync(ENV.STORAGE_KEYS.AUTH_TOKEN, response.token);
      await SecureStore.setItemAsync(ENV.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    }
    return { user: response.user };
  },

  register: async (payload: RegisterRequest): Promise<{ user: Usuario }> => {
    const response = await service.register(payload);
    if (!ENV.USE_MOCKS) {
      await SecureStore.setItemAsync(ENV.STORAGE_KEYS.AUTH_TOKEN, response.token);
      await SecureStore.setItemAsync(ENV.STORAGE_KEYS.REFRESH_TOKEN, response.refreshToken);
    }
    return { user: response.user };
  },

  logout: async (): Promise<void> => {
    try {
      await service.logout();
    } finally {
      await SecureStore.deleteItemAsync(ENV.STORAGE_KEYS.AUTH_TOKEN).catch(() => {});
      await SecureStore.deleteItemAsync(ENV.STORAGE_KEYS.REFRESH_TOKEN).catch(() => {});
      await SecureStore.deleteItemAsync(ENV.STORAGE_KEYS.USER_DATA).catch(() => {});
    }
  },
  getStoredUser: async (): Promise<Usuario | null> => {
    try {
      const token = await SecureStore.getItemAsync(ENV.STORAGE_KEYS.AUTH_TOKEN);
      if (!token) return null;
      const userData = await SecureStore.getItemAsync(ENV.STORAGE_KEYS.USER_DATA);
      if (userData) return JSON.parse(userData);
      return null;
    } catch (err) {
      console.warn('[AuthService] Erro ao recuperar usuário:', err);
      return null;
    }
  },
  saveUserData: async (user: Usuario): Promise<void> => {
    await SecureStore.setItemAsync(ENV.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },
};

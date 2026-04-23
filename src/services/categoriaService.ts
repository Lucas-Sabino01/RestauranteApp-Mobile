import api from './api';
import { ENV } from '../config/env.ts';
import type { Categoria } from '../types';
import { CATEGORIAS } from '../data/mock';

const categoriaApi = {
  listar: async (): Promise<Categoria[]> => {
    const { data } = await api.get<Categoria[]>('/categorias');
    return data;
  },
};

const categoriaMock = {
  listar: async (): Promise<Categoria[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return CATEGORIAS;
  },
};

export const categoriaService = ENV.USE_MOCKS ? categoriaMock : categoriaApi;

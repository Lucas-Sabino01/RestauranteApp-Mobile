import api from './api';
import { ENV } from '../config/env';
import type { Produto } from '../types';
import { PRODUTOS } from '../data/mock';

const produtoApi = {
  listar: async (categoria?: string): Promise<Produto[]> => {
    const params = categoria && categoria !== 'Tudo' ? { categoria } : {};
    const { data } = await api.get<Produto[]>('/produtos', { params });
    return data;
  },

  buscarPorId: async (id: string): Promise<Produto> => {
    const { data } = await api.get<Produto>(`/produtos/${id}`);
    return data;
  },

  destaques: async (): Promise<Produto[]> => {
    const { data } = await api.get<Produto[]>('/produtos/destaques');
    return data;
  },

  buscar: async (termo: string): Promise<Produto[]> => {
    const { data } = await api.get<Produto[]>('/produtos/buscar', {
      params: { q: termo },
    });
    return data;
  },
};

const produtoMock = {
  listar: async (categoria?: string): Promise<Produto[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!categoria || categoria === 'Tudo') return PRODUTOS;
    return PRODUTOS.filter((p) => p.categoria === categoria);
  },

  buscarPorId: async (id: string): Promise<Produto> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const produto = PRODUTOS.find((p) => p.id === id);
    if (!produto) throw new Error('Produto não encontrado');
    return produto;
  },

  destaques: async (): Promise<Produto[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return PRODUTOS.filter((p) => p.destaque);
  },

  buscar: async (termo: string): Promise<Produto[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const termoLower = termo.toLowerCase();
    return PRODUTOS.filter(
      (p) =>
        p.nome.toLowerCase().includes(termoLower) ||
        p.descricao.toLowerCase().includes(termoLower) ||
        p.categoria.toLowerCase().includes(termoLower)
    );
  },
};

export const produtoService = ENV.USE_MOCKS ? produtoMock : produtoApi;

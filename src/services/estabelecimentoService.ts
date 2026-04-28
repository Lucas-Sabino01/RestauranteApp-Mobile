import api from './api';
import { ENV } from '../config/env';
import type { Estabelecimento } from '../types';
import { ESTABELECIMENTOS } from '../data/mock';

const estabelecimentoApi = {
  listar: async (categoria?: string): Promise<Estabelecimento[]> => {
    const params = categoria && categoria !== 'Tudo' ? { categoria } : {};
    const { data } = await api.get<Estabelecimento[]>('/estabelecimentos', { params });
    return data;
  },

  buscarPorId: async (id: string): Promise<Estabelecimento> => {
    const { data } = await api.get<Estabelecimento>(`/estabelecimentos/${id}`);
    return data;
  },

  destaques: async (): Promise<Estabelecimento[]> => {
    const { data } = await api.get<Estabelecimento[]>('/estabelecimentos/destaques');
    return data;
  },

  buscar: async (termo: string): Promise<Estabelecimento[]> => {
    const { data } = await api.get<Estabelecimento[]>('/estabelecimentos/buscar', {
      params: { q: termo },
    });
    return data;
  },
};

const estabelecimentoMock = {
  listar: async (categoria?: string): Promise<Estabelecimento[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (!categoria || categoria === 'Tudo') return ESTABELECIMENTOS;
    return ESTABELECIMENTOS.filter((e) => e.categoria === categoria);
  },

  buscarPorId: async (id: string): Promise<Estabelecimento> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const estabelecimento = ESTABELECIMENTOS.find((e) => e.id === id);
    if (!estabelecimento) throw new Error('Estabelecimento não encontrado');
    return estabelecimento;
  },

  destaques: async (): Promise<Estabelecimento[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return ESTABELECIMENTOS.filter((e) => e.destaque);
  },

  buscar: async (termo: string): Promise<Estabelecimento[]> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const termoLower = termo.toLowerCase();
    return ESTABELECIMENTOS.filter(
      (e) =>
        e.nome.toLowerCase().includes(termoLower) ||
        e.descricao.toLowerCase().includes(termoLower) ||
        e.bairro.toLowerCase().includes(termoLower) ||
        e.categoria.toLowerCase().includes(termoLower) ||
        (e.tags || []).some((tag) => tag.toLowerCase().includes(termoLower))
    );
  },
};

export const estabelecimentoService = ENV.USE_MOCKS ? estabelecimentoMock : estabelecimentoApi;

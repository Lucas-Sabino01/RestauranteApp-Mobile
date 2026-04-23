import api from './api';
import { ENV } from '../config/env.ts';
import type { Pedido, CreatePedidoRequest } from '../types';
import { PEDIDOS_MOCK } from '../data/mock';

const pedidoApi = {
  listar: async (): Promise<Pedido[]> => {
    const { data } = await api.get<Pedido[]>('/pedidos');
    return data;
  },

  buscarPorId: async (id: string): Promise<Pedido> => {
    const { data } = await api.get<Pedido>(`/pedidos/${id}`);
    return data;
  },

  criar: async (payload: CreatePedidoRequest): Promise<Pedido> => {
    const { data } = await api.post<Pedido>('/pedidos', payload);
    return data;
  },
};

const pedidoMock = {
  listar: async (): Promise<Pedido[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return PEDIDOS_MOCK;
  },

  buscarPorId: async (id: string): Promise<Pedido> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const pedido = PEDIDOS_MOCK.find((p) => p.id === id);
    if (!pedido) throw new Error('Pedido não encontrado');
    return pedido;
  },

  criar: async (payload: CreatePedidoRequest): Promise<Pedido> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const novoPedido: Pedido = {
      id: `PED${String(Date.now()).slice(-4)}`,
      data: new Date().toLocaleDateString('pt-BR'),
      itens: payload.itens.map((item) => ({
        nome: `Produto #${item.produtoId}`,
        quantidade: item.quantidade,
        tamanho: item.tamanho,
      })),
      total: 0,
      status: 'preparando',
    };
    return novoPedido;
  },
};

export const pedidoService = ENV.USE_MOCKS ? pedidoMock : pedidoApi;

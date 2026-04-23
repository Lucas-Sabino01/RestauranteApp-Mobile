import { useState, useEffect, useCallback } from 'react';
import type { Pedido, CreatePedidoRequest } from '../types';
import { pedidoService } from '../services/pedidoService';

type UseOrdersReturn = {
  orders: Pedido[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createOrder: (payload: CreatePedidoRequest) => Promise<Pedido>;
  creating: boolean;
};

export const useOrders = (): UseOrdersReturn => {
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await pedidoService.listar();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = useCallback(async (payload: CreatePedidoRequest): Promise<Pedido> => {
    setCreating(true);
    try {
      const novoPedido = await pedidoService.criar(payload);
      setOrders((prev) => [novoPedido, ...prev]);
      return novoPedido;
    } finally {
      setCreating(false);
    }
  }, []);

  return { orders, loading, error, refetch: fetchOrders, createOrder, creating };
};

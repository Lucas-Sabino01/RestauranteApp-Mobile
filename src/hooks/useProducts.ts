import { useState, useEffect, useCallback } from 'react';
import type { Produto } from '../types';
import { produtoService } from '../services/produtoService';

type UseProductsReturn = {
  products: Produto[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export const useProducts = (categoria?: string): UseProductsReturn => {
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await produtoService.listar(categoria);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  }, [categoria]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

export const useDestaques = (): UseProductsReturn => {
  const [products, setProducts] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestaques = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await produtoService.destaques();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar destaques');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestaques();
  }, [fetchDestaques]);

  return { products, loading, error, refetch: fetchDestaques };
};

export const useSearchProducts = () => {
  const [results, setResults] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (termo: string) => {
    if (termo.trim().length === 0) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await produtoService.buscar(termo);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na busca');
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  return { results, loading, error, search, clearResults };
};

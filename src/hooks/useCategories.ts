import { useState, useEffect, useCallback } from 'react';
import type { Categoria } from '../types';
import { categoriaService } from '../services/categoriaService';

type UseCategoriesReturn = {
  categories: Categoria[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export const useCategories = (): UseCategoriesReturn => {
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoriaService.listar();
      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

import { useState, useCallback, useEffect } from 'react';
import type { Estabelecimento } from '../types';
import { estabelecimentoService } from '../services/estabelecimentoService';
import { useAsyncData } from './useAsyncData';

export const useEstabelecimentos = (categoria?: string) => {
  return useAsyncData<Estabelecimento[]>(
    () => estabelecimentoService.listar(categoria),
    [],
    [categoria],
  );
};

export const useDestaques = () => {
  return useAsyncData<Estabelecimento[]>(
    () => estabelecimentoService.destaques(),
    [],
  );
};

type UseSearchReturn = {
  results: Estabelecimento[];
  loading: boolean;
  error: string | null;
  search: (termo: string) => void;
};

export const useSearchEstabelecimentos = (): UseSearchReturn => {
  const [results, setResults] = useState<Estabelecimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (termo: string) => {
    try {
      setLoading(true);
      setError(null);
      if (!termo.trim()) {
        const all = await estabelecimentoService.listar();
        setResults(all);
      } else {
        const data = await estabelecimentoService.buscar(termo);
        setResults(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na busca');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search('');
  }, [search]);

  return { results, loading, error, search };
};

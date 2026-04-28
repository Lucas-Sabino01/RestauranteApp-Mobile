import { useState, useEffect, useCallback } from 'react';
import type { Estabelecimento } from '../types';
import { estabelecimentoService } from '../services/estabelecimentoService';

type UseEstabelecimentosReturn = {
  estabelecimentos: Estabelecimento[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export const useEstabelecimentos = (categoria?: string): UseEstabelecimentosReturn => {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEstabelecimentos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await estabelecimentoService.listar(categoria);
      setEstabelecimentos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar estabelecimentos');
    } finally {
      setLoading(false);
    }
  }, [categoria]);

  useEffect(() => {
    fetchEstabelecimentos();
  }, [fetchEstabelecimentos]);

  return { estabelecimentos, loading, error, refetch: fetchEstabelecimentos };
};

export const useDestaques = (): UseEstabelecimentosReturn => {
  const [estabelecimentos, setEstabelecimentos] = useState<Estabelecimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDestaques = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await estabelecimentoService.destaques();
      setEstabelecimentos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar destaques');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDestaques();
  }, [fetchDestaques]);

  return { estabelecimentos, loading, error, refetch: fetchDestaques };
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
    if (!termo.trim()) {
      setResults([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await estabelecimentoService.buscar(termo);
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na busca');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
};

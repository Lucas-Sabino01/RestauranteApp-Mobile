import { useState, useEffect, useCallback } from 'react';

type UseAsyncDataOptions = {
  immediate?: boolean;
};

type UseAsyncDataReturn<T> = {
  data: T;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  initialData: T,
  deps: unknown[] = [],
  options: UseAsyncDataOptions = { immediate: true }
): UseAsyncDataReturn<T> {
  const [data, setData] = useState<T>(initialData);
  const [loading, setLoading] = useState(options.immediate !== false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetcher();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (options.immediate !== false) {
      execute();
    }
  }, [execute, options.immediate]);

  return { data, loading, error, refetch: execute };
}

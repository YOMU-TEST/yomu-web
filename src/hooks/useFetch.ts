import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError } from '@/services/apiClient';

interface FetchState<T> {
  data: T | null;
  error: ApiError | null;
  isLoading: boolean;
}

export function useFetch<T>(
  fetchFn: () => Promise<T>,
  options: { immediate?: boolean; deps?: unknown[] } = {}
): FetchState<T> & { refetch: () => void } {
  const { immediate = true, deps = [] } = options;
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: immediate,
  });
  const fetchFnRef = useRef(fetchFn);
  fetchFnRef.current = fetchFn;

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await fetchFnRef.current();
      setState({ data: result, error: null, isLoading: false });
    } catch (err) {
      setState({ data: null, error: err as ApiError, isLoading: false });
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, refetch: execute };
}

export function usePaginatedFetch<T>(
  fetchFn: (cursor?: string) => Promise<{ items: T[]; nextCursor?: string }>,
  options: { pageSize?: number } = {}
): {
  items: T[];
  isLoading: boolean;
  error: ApiError | null;
  loadMore: () => void;
  hasMore: boolean;
  reset: () => void;
} {
  const { pageSize = 20 } = options;
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const result = await fetchFn(cursor);
      setItems(prev => [...prev, ...result.items]);
      setCursor(result.nextCursor);
      setHasMore(!!result.nextCursor);
    } catch (err) {
      setError(err as ApiError);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, fetchFn, hasMore, isLoading]);

  const reset = useCallback(() => {
    setItems([]);
    setCursor(undefined);
    setHasMore(true);
    setError(null);
  }, []);

  return { items, isLoading, error, loadMore, hasMore, reset };
}
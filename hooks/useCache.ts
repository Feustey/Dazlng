import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live en millisecondes
  staleWhileRevalidate?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ClientCache {
  private cache = new Map<string, CacheEntry<unknown>>();

  set<T>(key: string, data: T, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}

const clientCache = new ClientCache();

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  invalidate: () => void;
} {
  const { ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;
  
  const [data, setData] = useState<T | null>(() => clientCache.get<T>(key));
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      if (!staleWhileRevalidate || !data) {
        setLoading(true);
      }

      const result = await fetcher();
      clientCache.set(key, result, ttl);
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, staleWhileRevalidate, data]);

  const refetch = useCallback(async (): Promise<void> => {
    clientCache.invalidate(key);
    await fetchData();
  }, [key, fetchData]);

  const invalidate = useCallback((): void => {
    clientCache.invalidate(key);
    setData(null);
  }, [key]);

  useEffect(() => {
    if (!clientCache.has(key)) {
      fetchData();
    }
  }, [key, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    invalidate
  };
} 
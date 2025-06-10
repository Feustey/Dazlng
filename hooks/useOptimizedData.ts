import { useState, useEffect, useCallback, useMemo } from 'react';

interface CacheOptions {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  key: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// Cache global en mémoire
const cache = new Map<string, CacheEntry<any>>();

export function useOptimizedData<T>(
  fetcher: () => Promise<T>,
  options: CacheOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { key, ttl = 5 * 60 * 1000, staleWhileRevalidate = true } = options;

  const isDataFresh = useCallback((entry: CacheEntry<T>): boolean => {
    return Date.now() - entry.timestamp < entry.ttl;
  }, []);

  const fetchData = useCallback(async (useCache = true) => {
    try {
      setError(null);

      // Vérifier le cache si demandé
      if (useCache) {
        const cached = cache.get(key);
        if (cached && isDataFresh(cached)) {
          setData(cached.data);
          setLoading(false);
          return cached.data;
        }

        // Si stale-while-revalidate et qu'on a des données stale
        if (staleWhileRevalidate && cached) {
          setData(cached.data);
          setLoading(false);
          // Continue en arrière-plan pour revalidate
        }
      }

      // Marquer comme en cours de chargement si pas de données stale
      if (!data || !staleWhileRevalidate) {
        setLoading(true);
      }

      // Fetcher les nouvelles données
      const newData = await fetcher();
      
      // Mettre en cache
      cache.set(key, {
        data: newData,
        timestamp: Date.now(),
        ttl
      });

      setData(newData);
      setError(null);
      return newData;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erreur inconnue');
      setError(error);
      
      // Fallback sur cache stale si disponible et option activée
      if (staleWhileRevalidate) {
        const staleData = cache.get(key);
        if (staleData) {
          setData(staleData.data);
          return staleData.data;
        }
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetcher, key, ttl, staleWhileRevalidate, data, isDataFresh]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => fetchData(false), [fetchData]);
  
  const clearCache = useCallback(() => {
    cache.delete(key);
  }, [key]);

  const invalidateCache = useCallback(() => {
    cache.delete(key);
    fetchData(false);
  }, [key, fetchData]);

  return useMemo(() => ({
    data,
    loading,
    error,
    refetch,
    clearCache,
    invalidateCache,
    isCached: cache.has(key)
  }), [data, loading, error, refetch, clearCache, invalidateCache, key]);
}

// Hook utilitaire pour précharger des données
export function usePrefetchData<T>(
  fetcher: () => Promise<T>,
  key: string,
  ttl: number = 5 * 60 * 1000
) {
  useEffect(() => {
    const prefetch = async () => {
      try {
        // Vérifier si déjà en cache
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
          return;
        }

        // Précharger les données
        const data = await fetcher();
        cache.set(key, {
          data,
          timestamp: Date.now(),
          ttl
        });
      } catch (err) {
        // Silent fail pour le prefetch
        console.warn('Prefetch failed for key:', key, err);
      }
    };

    prefetch();
  }, [fetcher, key, ttl]);
}

// Utilitaire pour nettoyer le cache
export function clearAllCache() {
  cache.clear();
}

// Utilitaire pour obtenir les stats du cache
export function getCacheStats() {
  const entries = Array.from(cache.entries());
  const now = Date.now();
  
  return {
    totalEntries: entries.length,
    freshEntries: entries.filter(([, entry]) => now - entry.timestamp < entry.ttl).length,
    staleEntries: entries.filter(([, entry]) => now - entry.timestamp >= entry.ttl).length,
    cacheKeys: entries.map(([key]) => key)
  };
} 
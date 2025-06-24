import { useState, useEffect, useCallback } from 'react';

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  storage?: 'memory' | 'local' | 'session';
  revalidate?: boolean;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function useCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
) {
  const {
    ttl = 5 * 60 * 1000, // 5 minutes par défaut
    storage = 'memory',
    revalidate = false
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mémoire cache en RAM
  const memoryCache = new Map<string, CacheEntry<T>>();

  // Vérifier si une entrée est expirée
  const isExpired = (entry: CacheEntry<T>) => {
    return Date.now() - entry.timestamp > entry.ttl;
  };

  // Sauvegarder dans le storage
  const saveToStorage = useCallback((key: string, entry: CacheEntry<T>) => {
    if (storage === 'local') {
      localStorage.setItem(key, JSON.stringify(entry));
    } else if (storage === 'session') {
      sessionStorage.setItem(key, JSON.stringify(entry));
    } else {
      memoryCache.set(key, entry);
    }
  }, [storage]);

  // Récupérer du storage
  const getFromStorage = useCallback((key: string): CacheEntry<T> | null => {
    if (storage === 'local') {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } else if (storage === 'session') {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } else {
      return memoryCache.get(key) || null;
    }
  }, [storage]);

  // Supprimer du storage
  const removeFromStorage = useCallback((key: string) => {
    if (storage === 'local') {
      localStorage.removeItem(key);
    } else if (storage === 'session') {
      sessionStorage.removeItem(key);
    } else {
      memoryCache.delete(key);
    }
  }, [storage]);

  // Fonction de fetch avec mise en cache
  const fetchData = useCallback(async (force = false) => {
    try {
      setLoading(true);

      // Vérifier le cache sauf si force refresh
      if (!force) {
        const cached = getFromStorage(key);
        if (cached && !isExpired(cached)) {
          setData(cached.data);
          setLoading(false);
          return;
        }
      }

      // Fetch des données
      const freshData = await fetcher();

      // Sauvegarder dans le cache
      const entry: CacheEntry<T> = {
        data: freshData,
        timestamp: Date.now(),
        ttl
      };
      saveToStorage(key, entry);

      setData(freshData);
      setError(null);
    } catch (err) {
      setError(err as Error);
      // En cas d'erreur, on garde les données en cache si disponibles
      const cached = getFromStorage(key);
      if (cached) {
        setData(cached.data);
      }
    } finally {
      setLoading(false);
    }
  }, [key, fetcher, ttl, getFromStorage, saveToStorage]);

  // Revalider les données
  const refetch = useCallback(() => fetchData(true), [fetchData]);

  // Invalider le cache
  const invalidate = useCallback(() => {
    removeFromStorage(key);
    setData(null);
  }, [key, removeFromStorage]);

  // Effet initial
  useEffect(() => {
    fetchData();

    // Revalidation périodique si activée
    let interval: NodeJS.Timeout;
    if (revalidate) {
      interval = setInterval(() => {
        fetchData(true);
      }, ttl);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [fetchData, revalidate, ttl]);

  return { data, loading, error, refetch, invalidate };
} 
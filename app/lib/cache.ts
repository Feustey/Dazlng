type CacheEntry<T> = {
  data: T;
  timestamp: number;
};

class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private defaultTTL: number; // Durée de vie par défaut en millisecondes

  constructor(defaultTTL: number = 60 * 1000) {
    // 1 minute par défaut
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  /**
   * Récupère une donnée du cache ou exécute la fonction fournie pour l'obtenir
   * @param key Clé de cache
   * @param fetchFn Fonction à exécuter si la donnée n'est pas en cache
   * @param ttl Durée de vie personnalisée (optionnelle)
   */
  async get<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl?: number
  ): Promise<T> {
    const now = Date.now();
    const cacheEntry = this.cache.get(key);

    // Vérifier si l'entrée existe et n'est pas expirée
    if (cacheEntry && now - cacheEntry.timestamp < (ttl || this.defaultTTL)) {
      return cacheEntry.data;
    }

    // Sinon, exécuter la fonction et mettre en cache le résultat
    try {
      const data = await fetchFn();
      this.cache.set(key, {
        data,
        timestamp: now,
      });
      return data;
    } catch (error) {
      // Si l'entrée en cache existe mais est expirée, utiliser les données périmées plutôt que d'échouer
      if (cacheEntry) {
        console.warn(
          `Erreur lors de la récupération des données fraîches pour ${key}, utilisation des données périmées.`
        );
        return cacheEntry.data;
      }
      throw error;
    }
  }

  /**
   * Invalide une entrée de cache spécifique
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalide toutes les entrées de cache correspondant à un préfixe
   */
  invalidateByPrefix(prefix: string): void {
    const keysToDelete: string[] = [];

    // Collecter d'abord les clés à supprimer
    this.cache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });

    // Puis les supprimer
    keysToDelete.forEach((key) => {
      this.cache.delete(key);
    });
  }

  /**
   * Vide complètement le cache
   */
  clear(): void {
    this.cache.clear();
  }
}

// Exporter une instance singleton pour l'utiliser dans toute l'application
export const cacheManager = new CacheManager();

// Helper pour créer une clé de cache basée sur les paramètres
export function createCacheKey(
  baseKey: string,
  params?: Record<string, any>
): string {
  if (!params) return baseKey;
  return `${baseKey}:${Object.entries(params)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join("&")}`;
}

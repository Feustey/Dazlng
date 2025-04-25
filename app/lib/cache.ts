type CacheEntry<T> = { value: T; expiry: number };

const cacheStore = new Map<string, CacheEntry<any>>();

export function createCacheKey(
  prefix: string,
  params: Record<string, any>
): string {
  return `${prefix}:${JSON.stringify(params)}`;
}

export const cacheManager = {
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    const now = Date.now();
    const entry = cacheStore.get(key);
    if (entry && entry.expiry > now) {
      return entry.value;
    }
    const data = await fetcher();
    cacheStore.set(key, { value: data, expiry: now + ttl });
    return data;
  },
  invalidate(key: string) {
    cacheStore.delete(key);
  },
};

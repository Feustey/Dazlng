export class QueryOptimizer {
  private static instance: QueryOptimizer;
  private cache: Map<string, any>;

  private constructor() {
    this.cache = new Map();
  }

  public static getInstance(): QueryOptimizer {
    if (!QueryOptimizer.instance) {
      QueryOptimizer.instance = new QueryOptimizer();
    }
    return QueryOptimizer.instance;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCachedQuery(key: string): any {
    return this.cache.get(key);
  }

  public cacheQuery(key: string, value: any): void {
    this.cache.set(key, value);
  }
}

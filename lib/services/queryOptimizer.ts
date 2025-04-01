import { connectToDatabase } from '@/lib/mongodb';
import Node from '@/models/Node';
import PeerOfPeer from '@/models/PeerOfPeer';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class QueryOptimizer {
  private static instance: QueryOptimizer;
  private queryCache: Map<string, CacheEntry<any>> = new Map();
  private CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): QueryOptimizer {
    if (!QueryOptimizer.instance) {
      QueryOptimizer.instance = new QueryOptimizer();
    }
    return QueryOptimizer.instance;
  }

  private getCacheKey(operation: string, params: Record<string, any>): string {
    return `${operation}:${JSON.stringify(params)}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  async getNodeWithOptimizedQuery(pubkey: string) {
    const cacheKey = this.getCacheKey('getNode', { pubkey });
    const cachedResult = this.queryCache.get(cacheKey);

    if (cachedResult && this.isCacheValid(cachedResult.timestamp)) {
      return cachedResult.data;
    }

    try {
      await connectToDatabase();
      const node = await Node.findOne({ pubkey })
        .select('pubkey alias platform version total_capacity active_channel_count total_peers uptime')
        .lean();

      if (node) {
        this.queryCache.set(cacheKey, {
          data: node,
          timestamp: Date.now()
        });
      }

      return node;
    } catch (error) {
      console.error('Erreur lors de la récupération du nœud:', error);
      throw error;
    }
  }

  async getTopNodes(limit: number) {
    const cacheKey = this.getCacheKey('getTopNodes', { limit });
    const cachedResult = this.queryCache.get(cacheKey);

    if (cachedResult && this.isCacheValid(cachedResult.timestamp)) {
      return cachedResult.data;
    }

    try {
      await connectToDatabase();
      const nodes = await Node.find()
        .sort({ total_capacity: -1 })
        .limit(limit)
        .select('pubkey alias total_capacity active_channel_count total_peers uptime')
        .lean();

      this.queryCache.set(cacheKey, {
        data: nodes,
        timestamp: Date.now()
      });

      return nodes;
    } catch (error) {
      console.error('Erreur lors de la récupération des top nœuds:', error);
      throw error;
    }
  }

  async getPeersOfPeersWithOptimizedQuery(nodePubkey: string) {
    const cacheKey = this.getCacheKey('getPeersOfPeers', { nodePubkey });
    const cachedResult = this.queryCache.get(cacheKey);

    if (cachedResult && this.isCacheValid(cachedResult.timestamp)) {
      return cachedResult.data;
    }

    try {
      await connectToDatabase();
      const peers = await PeerOfPeer.find({ nodePubkey })
        .sort({ timestamp: -1 })
        .limit(50)
        .select('peerPubkey alias total_capacity active_channels total_peers')
        .lean();

      this.queryCache.set(cacheKey, {
        data: peers,
        timestamp: Date.now()
      });

      return peers;
    } catch (error) {
      console.error('Erreur lors de la récupération des pairs:', error);
      throw error;
    }
  }

  clearCache(): void {
    this.queryCache.clear();
    console.log('Cache vidé');
  }

  setCacheTTL(ttl: number): void {
    this.CACHE_TTL = ttl;
    console.log(`TTL du cache mis à jour: ${ttl}ms`);
  }
} 
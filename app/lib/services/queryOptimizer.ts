import { connectToDatabase } from "@/lib/mongodb";
import Node from "@/models/Node";
import PeerOfPeer from "@/models/PeerOfPeer";
import { Document } from "mongoose";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface NodeDocument extends Document {
  pubkey: string;
  alias: string;
  platform: string;
  version: string;
  total_capacity: number;
  active_channel_count: number;
  total_peers: number;
  uptime: number;
}

interface PeerOfPeerDocument extends Document {
  peerPubkey: string;
  alias: string;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
}

export class QueryOptimizer {
  private static instance: QueryOptimizer;
  private queryCache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): QueryOptimizer {
    if (!QueryOptimizer.instance) {
      QueryOptimizer.instance = new QueryOptimizer();
    }
    return QueryOptimizer.instance;
  }

  private getCacheKey(
    operation: string,
    params: Record<string, unknown>
  ): string {
    return `${operation}:${JSON.stringify(params)}`;
  }

  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_TTL;
  }

  async getNodeWithOptimizedQuery(
    pubkey: string
  ): Promise<NodeDocument | null> {
    const cacheKey = this.getCacheKey("getNode", { pubkey });
    const cachedResult = this.queryCache.get(cacheKey) as
      | CacheEntry<NodeDocument>
      | undefined;

    if (cachedResult && this.isCacheValid(cachedResult.timestamp)) {
      return cachedResult.data;
    }

    try {
      await connectToDatabase();
      const node = await Node.findOne({ pubkey })
        .select(
          "pubkey alias platform version total_capacity active_channel_count total_peers uptime"
        )
        .lean();

      if (node) {
        this.queryCache.set(cacheKey, {
          data: node as NodeDocument,
          timestamp: Date.now(),
        });
      }

      return node as NodeDocument;
    } catch (error) {
      console.error("Erreur lors de la récupération du nœud:", error);
      throw error;
    }
  }

  async getTopNodes(limit: number): Promise<NodeDocument[]> {
    const cacheKey = this.getCacheKey("getTopNodes", { limit });
    const cachedResult = this.queryCache.get(cacheKey) as
      | CacheEntry<NodeDocument[]>
      | undefined;

    if (cachedResult && this.isCacheValid(cachedResult.timestamp)) {
      return cachedResult.data;
    }

    try {
      await connectToDatabase();
      const nodes = await Node.find()
        .sort({ total_capacity: -1 })
        .limit(limit)
        .select(
          "pubkey alias total_capacity active_channel_count total_peers uptime"
        )
        .lean();

      this.queryCache.set(cacheKey, {
        data: nodes as NodeDocument[],
        timestamp: Date.now(),
      });

      return nodes as NodeDocument[];
    } catch (error) {
      console.error("Erreur lors de la récupération des top nœuds:", error);
      throw error;
    }
  }

  async getPeersOfPeersWithOptimizedQuery(
    nodePubkey: string
  ): Promise<PeerOfPeerDocument[]> {
    const cacheKey = this.getCacheKey("getPeersOfPeers", { nodePubkey });
    const cachedResult = this.queryCache.get(cacheKey) as
      | CacheEntry<PeerOfPeerDocument[]>
      | undefined;

    if (cachedResult && this.isCacheValid(cachedResult.timestamp)) {
      return cachedResult.data;
    }

    try {
      await connectToDatabase();
      const peers = await PeerOfPeer.find({ nodePubkey })
        .sort({ timestamp: -1 })
        .limit(50)
        .select("peerPubkey alias total_capacity active_channels total_peers")
        .lean();

      this.queryCache.set(cacheKey, {
        data: peers as PeerOfPeerDocument[],
        timestamp: Date.now(),
      });

      return peers as PeerOfPeerDocument[];
    } catch (error) {
      console.error("Erreur lors de la récupération des pairs:", error);
      throw error;
    }
  }

  clearCache(): void {
    this.queryCache.clear();
    console.log("Cache vidé");
  }
}

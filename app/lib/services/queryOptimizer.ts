import { MongoClient } from "mongodb";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface NodeDocument {
  pubkey: string;
  alias: string;
  platform: string;
  version: string;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
  uptime: number;
}

interface PeerOfPeerDocument {
  peerPubkey: string;
  alias: string;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("La variable d'environnement MONGODB_URI est requise");
}

export class QueryOptimizer {
  private static instance: QueryOptimizer;
  private queryCache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private client: MongoClient;

  private constructor() {
    this.client = new MongoClient(MONGODB_URI as string);
  }

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

  private async connect() {
    if (!this.client.connect) {
      await this.client.connect();
    }
    return this.client.db();
  }

  private async disconnect() {
    await this.client.close();
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
      const db = await this.connect();
      const node = await db.collection("nodes").findOne(
        { pubkey },
        {
          projection: {
            pubkey: 1,
            alias: 1,
            platform: 1,
            version: 1,
            total_capacity: 1,
            active_channels: 1,
            total_peers: 1,
            uptime: 1,
          },
        }
      );

      if (node) {
        const nodeDocument: NodeDocument = {
          pubkey: node.pubkey,
          alias: node.alias,
          platform: node.platform,
          version: node.version,
          total_capacity: Number(node.total_capacity),
          active_channels: node.active_channels,
          total_peers: node.total_peers,
          uptime: Number(node.uptime),
        };

        this.queryCache.set(cacheKey, {
          data: nodeDocument,
          timestamp: Date.now(),
        });

        return nodeDocument;
      }

      return null;
    } catch (error) {
      console.error("Erreur lors de la récupération du nœud:", error);
      throw error;
    } finally {
      await this.disconnect();
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
      const db = await this.connect();
      const nodes = await db
        .collection("nodes")
        .find(
          {},
          {
            projection: {
              pubkey: 1,
              alias: 1,
              total_capacity: 1,
              active_channels: 1,
              total_peers: 1,
              uptime: 1,
            },
          }
        )
        .sort({ total_capacity: -1 })
        .limit(limit)
        .toArray();

      const nodeDocuments: NodeDocument[] = nodes.map((node) => ({
        pubkey: node.pubkey,
        alias: node.alias,
        platform: node.platform || "",
        version: node.version || "",
        total_capacity: Number(node.total_capacity),
        active_channels: node.active_channels,
        total_peers: node.total_peers,
        uptime: Number(node.uptime),
      }));

      this.queryCache.set(cacheKey, {
        data: nodeDocuments,
        timestamp: Date.now(),
      });

      return nodeDocuments;
    } catch (error) {
      console.error("Erreur lors de la récupération des top nœuds:", error);
      throw error;
    } finally {
      await this.disconnect();
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
      const db = await this.connect();
      const peers = await db
        .collection("peers")
        .find(
          { nodePubkey },
          {
            projection: {
              peerPubkey: 1,
              alias: 1,
              total_capacity: 1,
              active_channels: 1,
              total_peers: 1,
            },
          }
        )
        .sort({ timestamp: -1 })
        .limit(50)
        .toArray();

      const peerDocuments: PeerOfPeerDocument[] = peers.map((peer) => ({
        peerPubkey: peer.peerPubkey,
        alias: peer.alias,
        total_capacity: Number(peer.total_capacity),
        active_channels: peer.active_channels,
        total_peers: peer.total_peers,
      }));

      this.queryCache.set(cacheKey, {
        data: peerDocuments,
        timestamp: Date.now(),
      });

      return peerDocuments;
    } catch (error) {
      console.error("Erreur lors de la récupération des pairs:", error);
      throw error;
    } finally {
      await this.disconnect();
    }
  }

  clearCache(): void {
    this.queryCache.clear();
    console.log("Cache vidé");
  }
}

export default QueryOptimizer.getInstance();

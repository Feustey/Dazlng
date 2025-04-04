"use client";

import { PrismaClient } from "@prisma/client";

import { prisma } from "./db";

interface Node {
  pubkey: string;
  alias: string;
  platform: string;
  version: string;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
  uptime: number;
}

interface PeerOfPeer {
  peerPubkey: string;
  alias: string;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
}

interface NodeStats {
  pubkey: string;
  alias: string;
  color: string;
  platform: string;
  version: string;
  address: string;
  total_fees: number;
  avg_fee_rate_ppm: number;
  total_capacity: number;
  active_channels: number;
  total_volume: number;
  total_peers: number;
  uptime: number;
  opened_channel_count: number;
  closed_channel_count: number;
  pending_channel_count: number;
  avg_capacity: number;
  avg_fee_rate: number;
  avg_base_fee_rate: number;
  betweenness_rank: number;
  eigenvector_rank: number;
  closeness_rank: number;
  weighted_betweenness_rank: number;
  weighted_closeness_rank: number;
  weighted_eigenvector_rank: number;
  last_update: string;
}

interface HistoricalData {
  timestamp: string;
  total_fees: number;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
  total_volume: number;
}

interface CentralityData {
  betweenness: number;
  closeness: number;
  eigenvector: number;
}

interface NetworkSummaryData {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgCapacityPerChannel: number;
  avgChannelsPerNode: number;
  timestamp: string;
}

interface OptimizationResult {
  status: string;
  message?: string;
  // ... autres détails
}

interface NodeInfo {
  // ... structure des informations du noeud (peut-être similaire à Node ou NodeStats ?)
  pubkey: string;
  alias: string;
  // ...
}

// Constante pour l'alias du nœud de secours
const FALLBACK_NODE_ALIAS = "feustey";

const mcpService = {
  async getAllNodes(): Promise<Node[]> {
    try {
      // Utilisation d'une transaction pour garantir la cohérence des données
      const { data: nodes, info } = await prisma.$transaction(
        async (tx: PrismaClient) => {
          return tx.node
            .findMany({
              select: {
                pubkey: true,
                alias: true,
                platform: true,
                version: true,
                total_capacity: true,
                active_channels: true,
                total_peers: true,
                uptime: true,
              },
              orderBy: {
                total_capacity: "desc",
              },
              cacheStrategy: {
                swr: 60, // 1 minute de SWR pour des données fraîches
                ttl: 300, // 5 minutes de TTL car les nœuds changent fréquemment
                tags: ["all_nodes"],
              },
            })
            .withAccelerateInfo();
        },
        {
          timeout: 10000, // 10 secondes de timeout pour la transaction
          maxWait: 5000, // 5 secondes d'attente maximale pour une connexion
        }
      );

      console.log("Cache status:", info.cacheStatus);
      console.log("Region:", info.region);
      console.log("Request ID:", info.requestId);

      return nodes;
    } catch (error) {
      console.error("Erreur lors de la récupération des nœuds:", error);
      throw error;
    }
  },

  async getPeersOfPeers(
    nodePubkey: string
  ): Promise<{ peers_of_peers: PeerOfPeer[] }> {
    try {
      const peers = await prisma.peerOfPeer.findMany({
        where: {
          nodePubkey: nodePubkey,
        },
        select: {
          peerPubkey: true,
          alias: true,
          total_capacity: true,
          active_channels: true,
          total_peers: true,
        },
        orderBy: {
          total_capacity: "desc",
        },
        cacheStrategy: { swr: 60, ttl: 300 },
      });
      return { peers_of_peers: peers };
    } catch (error) {
      console.error("Erreur lors de la récupération des pairs:", error);
      throw error;
    }
  },

  async getCurrentStats(): Promise<NodeStats> {
    try {
      // Utilisation d'une transaction pour les statistiques en temps réel
      const { data: stats, info } = await prisma.$transaction(
        async (tx: PrismaClient) => {
          return tx.node
            .findFirst({
              orderBy: {
                timestamp: "desc",
              },
              include: {
                _count: {
                  select: {
                    active_channels: true,
                  },
                },
              },
              cacheStrategy: {
                swr: 30, // 30 secondes de SWR pour des stats en temps réel
                ttl: 60, // 1 minute de TTL car les stats changent très fréquemment
                tags: ["current_stats"],
              },
            })
            .withAccelerateInfo();
        },
        {
          timeout: 5000, // 5 secondes de timeout pour les stats en temps réel
          maxWait: 2000, // 2 secondes d'attente maximale
        }
      );

      console.log("Cache status:", info.cacheStatus);
      return stats;
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      throw error;
    }
  },

  async getHistoricalData(): Promise<HistoricalData[]> {
    try {
      const { data, info } = await prisma.history
        .findMany({
          orderBy: {
            date: "asc",
          },
          select: {
            date: true,
            marketCap: true,
            volume: true,
          },
          cacheStrategy: {
            swr: 900, // 15 minutes de SWR car l'historique change rarement
            ttl: 3600, // 1 heure de TTL car c'est de l'historique
            tags: ["historical_data"],
          },
        })
        .withAccelerateInfo();

      console.log("Cache status:", info.cacheStatus);
      return data.map(
        (item: { date: Date; marketCap: number; volume: number }) => ({
          timestamp: item.date.toISOString(),
          total_fees: 0,
          total_capacity: item.marketCap,
          active_channels: 0,
          total_peers: 0,
          total_volume: item.volume,
        })
      );
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données historiques:",
        error
      );
      throw error;
    }
  },

  async getCentralities(): Promise<CentralityData> {
    try {
      const data = await prisma.centralityData.findFirst({
        orderBy: {
          timestamp: "desc",
        },
        select: {
          value: true,
        },
        cacheStrategy: { swr: 300, ttl: 900 }, // Cache de 15 minutes avec revalidation de 5 minutes
      });
      if (!data) {
        throw new Error("Aucune donnée de centralité trouvée");
      }
      return {
        betweenness: data.value,
        closeness: data.value,
        eigenvector: data.value,
      };
    } catch (error) {
      console.error("Erreur lors de la récupération des centralités:", error);
      throw error;
    }
  },

  async getNetworkSummary(): Promise<NetworkSummaryData> {
    try {
      const summary = await prisma.networkSummary.findFirst({
        orderBy: {
          timestamp: "desc",
        },
        select: {
          totalNodes: true,
          totalChannels: true,
          totalCapacity: true,
          avgChannelSize: true,
          timestamp: true,
        },
        cacheStrategy: { swr: 60, ttl: 300 }, // Cache de 5 minutes avec revalidation de 1 minute
      });
      if (!summary) {
        throw new Error("Aucun résumé du réseau trouvé");
      }
      return {
        totalNodes: summary.totalNodes,
        totalChannels: summary.totalChannels,
        totalCapacity: summary.totalCapacity,
        avgCapacityPerChannel: summary.avgChannelSize,
        avgChannelsPerNode: summary.totalChannels / summary.totalNodes,
        timestamp: summary.timestamp.toISOString(),
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération du résumé du réseau:",
        error
      );
      throw error;
    }
  },

  async optimizeNode(nodePubkey: string): Promise<OptimizationResult> {
    try {
      // Logique d'optimisation à implémenter
      return {
        status: "success",
        message: "Optimisation réussie",
      };
    } catch (error) {
      console.error("Erreur lors de l'optimisation du nœud:", error);
      throw error;
    }
  },

  async getNodeInfo(nodePubkey: string): Promise<NodeInfo> {
    try {
      const node = await prisma.node.findUnique({
        where: {
          pubkey: nodePubkey,
        },
        select: {
          pubkey: true,
          alias: true,
        },
        cacheStrategy: { swr: 60, ttl: 300 }, // Cache de 5 minutes avec revalidation de 1 minute
      });
      if (!node) {
        throw new Error("Nœud non trouvé");
      }
      return {
        pubkey: node.pubkey,
        alias: node.alias,
      };
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des informations du nœud:",
        error
      );
      throw error;
    }
  },

  async analyzeQuestion(
    question: string,
    nodePubkey: string
  ): Promise<string[]> {
    try {
      // Logique d'analyse à implémenter
      return ["Réponse 1", "Réponse 2"];
    } catch (error) {
      console.error("Erreur lors de l'analyse de la question:", error);
      throw error;
    }
  },
};

export default mcpService;

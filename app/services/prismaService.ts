import { PrismaClient } from "@prisma/client";
import { NetworkNode, NetworkChannel, NetworkStats } from "@/app/types/network";
import { prisma } from "@/app/lib/db";

interface PrismaNode {
  pubkey: string;
  alias: string;
  platform: string | null;
  total_capacity: number;
  active_channels: number;
  createdAt: Date;
  color?: string;
  addresses?: string[];
  city?: string;
  country?: string;
  isp?: string;
}

interface PrismaNetworkSummary {
  total_nodes: number;
  total_channels: number;
  total_capacity: number;
  avg_capacity: number;
  timestamp: Date;
}

interface PrismaPeerOfPeer {
  peerPubkey: string;
}

// Initialisation du client Prisma
const prismaClient = new PrismaClient();

export class PrismaService {
  // Récupérer tous les nœuds
  async getNodes(): Promise<NetworkNode[]> {
    try {
      const nodes = await prismaClient.node.findMany({
        orderBy: {
          total_capacity: "desc",
        },
        take: 100, // Limiter à 100 nœuds pour les performances
      });

      // Transformer les données Prisma en format attendu par notre interface
      return nodes.map((node: PrismaNode) => ({
        publicKey: node.pubkey,
        alias: node.alias,
        color: node.color || "#000000",
        addresses: node.addresses || [],
        lastUpdate: node.createdAt,
        capacity: node.total_capacity,
        channelCount: node.active_channels,
        avgChannelSize: node.total_capacity / (node.active_channels || 1),
        city: node.city,
        country: node.country,
        isp: node.isp,
        platform: node.platform || undefined,
      }));
    } catch (error) {
      console.error("Error fetching nodes from Prisma:", error);
      throw error;
    }
  }

  // Récupérer les détails d'un nœud
  async getNodeDetails(pubkey: string): Promise<NetworkNode | null> {
    const node = await prismaClient.node.findUnique({
      where: { pubkey },
      select: {
        pubkey: true,
        alias: true,
        platform: true,
        total_capacity: true,
        active_channels: true,
        total_peers: true,
        betweenness_rank: true,
        eigenvector_rank: true,
        closeness_rank: true,
        avg_capacity: true,
        avg_fee_rate: true,
        uptime: true,
      },
    });

    if (!node) return null;

    return this.transformNode(node);
  }

  // Récupérer les canaux d'un nœud
  async getNodeChannels(nodeId: string): Promise<NetworkChannel[]> {
    try {
      const peers = await prismaClient.peerOfPeer.findMany({
        where: {
          nodePubkey: nodeId,
        },
      });

      return peers.map((peer: PrismaPeerOfPeer) => ({
        channelId: `${nodeId}-${peer.peerPubkey}`,
        node1Pub: nodeId,
        node2Pub: peer.peerPubkey,
        capacity: 0, // Cette information n'est pas disponible dans la table PeerOfPeer
        lastUpdate: new Date(),
        status: "active" as const,
      }));
    } catch (error) {
      console.error("Error fetching node channels:", error);
      throw error;
    }
  }

  // Récupérer les statistiques du réseau
  async getNetworkStats(): Promise<NetworkStats> {
    const [summary, nodes, capacityHistory] = await Promise.all([
      prisma.networkSummary.findFirst({
        orderBy: { timestamp: "desc" },
        select: {
          totalNodes: true,
          totalChannels: true,
          totalCapacity: true,
          avgChannelSize: true,
          medianFeeRate: true,
        },
        cacheStrategy: {
          swr: 60,
          ttl: 300,
          tags: ["network_summary"],
        },
      }),
      prisma.node.findMany({
        orderBy: { total_capacity: "desc" },
        take: 20,
        select: {
          pubkey: true,
          alias: true,
          platform: true,
          total_capacity: true,
          active_channels: true,
          total_peers: true,
          betweenness_rank: true,
          eigenvector_rank: true,
          closeness_rank: true,
        },
        cacheStrategy: {
          swr: 60,
          ttl: 300,
          tags: ["top_nodes"],
        },
      }),
      prisma.history.findMany({
        orderBy: { date: "desc" },
        take: 30,
        select: {
          date: true,
          marketCap: true,
        },
        cacheStrategy: {
          swr: 300,
          ttl: 900,
          tags: ["capacity_history"],
        },
      }),
    ]);

    const topNodes = nodes.slice(0, 10).map(this.transformNode);
    const recentChannels = nodes.slice(10).map(this.transformChannel);

    const countryStats = await prisma.node.groupBy({
      by: ["platform"],
      _count: true,
      where: {
        platform: { not: null },
      },
    });

    const nodesByCountry = countryStats.reduce(
      (
        acc: Record<string, number>,
        { platform, _count }: { platform: string | null; _count: number }
      ) => {
        acc[platform || "unknown"] = _count;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalNodes: summary?.totalNodes || 0,
      totalChannels: summary?.totalChannels || 0,
      totalCapacity: (summary?.totalCapacity || 0).toString(),
      avgChannelSize: (summary?.avgChannelSize || 0).toString(),
      avgCapacityPerChannel: summary?.avgChannelSize || 0,
      avgChannelsPerNode: summary?.totalChannels
        ? summary.totalChannels / summary.totalNodes
        : 0,
      topNodes,
      recentChannels,
      nodesByCountry,
      capacityHistory: capacityHistory.map(
        (h: { date: Date; marketCap: number }) => ({
          date: h.date,
          value: Number(h.marketCap),
        })
      ),
    };
  }

  // Fonction utilitaire pour calculer l'âge d'un nœud
  calculateAge(createdAt: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdAt.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} jours`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} mois`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} an${years > 1 ? "s" : ""}`;
    }
  }

  private transformNode(node: any): NetworkNode {
    return {
      publicKey: node.pubkey,
      alias: node.alias || "",
      color: "#000000",
      addresses: [],
      lastUpdate: new Date(),
      capacity: Number(node.total_capacity),
      channelCount: node.active_channels,
      avgChannelSize:
        node.active_channels > 0
          ? Number(node.total_capacity) / node.active_channels
          : 0,
      platform: node.platform || "unknown",
    };
  }

  private transformChannel(node: any) {
    return {
      channelId: node.pubkey,
      node1Pub: "",
      node2Pub: node.pubkey,
      capacity: Number(node.total_capacity),
      lastUpdate: new Date(),
      status: "active" as const,
    };
  }
}

export const prismaService = new PrismaService();

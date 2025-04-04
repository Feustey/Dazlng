import { NetworkStats, NetworkNode, NetworkChannel } from "@/app/types/network";
import { prisma } from "@/app/lib/db";

export async function getNetworkStats(): Promise<NetworkStats> {
  try {
    // Essayer d'abord MCP
    const mcpResponse = await fetch(
      "https://mempool.space/api/v1/lightning/statistics/latest",
      {
        next: { revalidate: 300 }, // Revalider toutes les 5 minutes
      }
    );

    if (mcpResponse.ok) {
      const mcpData = await mcpResponse.json();
      return transformMCPData(mcpData);
    }

    // Si MCP échoue, utiliser Prisma
    return await getNetworkStatsFromPrisma();
  } catch (error) {
    console.error("Error fetching network stats:", error);
    // En dernier recours, utiliser Prisma
    return await getNetworkStatsFromPrisma();
  }
}

async function getNetworkStatsFromPrisma(): Promise<NetworkStats> {
  const [summary, nodes, capacityHistory] = await Promise.all([
    prisma.networkSummary.findFirst({
      orderBy: { timestamp: "desc" },
      cacheStrategy: {
        swr: 60,
        ttl: 300,
        tags: ["network_summary"],
      },
    }),
    prisma.node.findMany({
      orderBy: { total_capacity: "desc" },
      take: 20,
      include: {
        _count: {
          select: {
            active_channels: true,
          },
        },
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
      cacheStrategy: {
        swr: 300,
        ttl: 900,
        tags: ["capacity_history"],
      },
    }),
  ]);

  const topNodes = nodes.slice(0, 10);
  const recentChannels = nodes.slice(10);

  const countryStats = nodes.reduce(
    (acc: Record<string, number>, node: { platform?: string }) => {
      const platform = node.platform || "unknown";
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    },
    {}
  );

  return {
    totalNodes: summary?.totalNodes || 0,
    totalChannels: summary?.totalChannels || 0,
    totalCapacity: summary?.totalCapacity || 0,
    avgCapacityPerChannel: summary?.avgChannelSize || 0,
    avgChannelsPerNode: summary?.totalChannels
      ? summary.totalChannels / summary.totalNodes
      : 0,
    lastUpdate: summary?.timestamp || new Date(),
    topNodes: topNodes.map(transformPrismaNode),
    recentChannels: recentChannels.map(transformPrismaChannel),
    nodesByCountry: countryStats,
    capacityHistory: capacityHistory.map(
      (h: { date: Date; marketCap: number }) => ({
        date: h.date,
        value: h.marketCap,
      })
    ),
  };
}

function transformMCPData(mcpData: any): NetworkStats {
  return {
    totalNodes: mcpData.node_count || 0,
    totalChannels: mcpData.channel_count || 0,
    totalCapacity: mcpData.total_capacity || 0,
    avgCapacityPerChannel: mcpData.avg_capacity_per_channel || 0,
    avgChannelsPerNode: mcpData.avg_channels_per_node || 0,
    lastUpdate: new Date(mcpData.latest_update || Date.now()),
    topNodes: [], // À remplir avec des données supplémentaires de MCP si disponible
    recentChannels: [], // À remplir avec des données supplémentaires de MCP si disponible
    nodesByCountry: {}, // À remplir avec des données supplémentaires de MCP si disponible
    capacityHistory: [], // À remplir avec des données supplémentaires de MCP si disponible
  };
}

function transformPrismaNode(node: any): NetworkNode {
  return {
    publicKey: node.pubkey,
    alias: node.alias,
    color: node.color,
    addresses: [node.address],
    lastUpdate: node.updatedAt,
    capacity: node.total_capacity,
    channelCount: node.active_channels,
    avgChannelSize: node.avg_capacity,
    platform: node.platform,
  };
}

function transformPrismaChannel(node: any): NetworkChannel {
  return {
    channelId: node.pubkey,
    node1Pub: node.pubkey,
    node2Pub: "",
    capacity: node.total_capacity,
    lastUpdate: node.updatedAt,
    status: "active",
  };
}

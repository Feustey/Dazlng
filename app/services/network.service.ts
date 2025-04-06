"use server";

import { NetworkStats, NetworkNode, NetworkChannel } from "@/app/types/network";
import { prisma } from "@/app/lib/db";

interface MCPData {
  node_count: number;
  channel_count: number;
  total_capacity: number;
  avg_capacity: number;
  avg_fee_rate: number;
  timestamp: string;
  top_nodes: {
    pubkey: string;
    alias: string;
    color: string;
    addresses: string[];
    last_update: string;
    capacity: number;
    channel_count: number;
    avg_channel_size: number;
    city: string;
    country: string;
    isp: string;
    platform: string;
  }[];
  recent_channels: {
    channel_id: string;
    node1_pub: string;
    node2_pub: string;
    capacity: number;
    last_update: string;
    status: "active" | "inactive" | "closed";
  }[];
  nodes_by_country: Record<string, number>;
  capacity_history: {
    date: string;
    value: number;
  }[];
}

interface PrismaNode {
  pubkey: string;
  alias: string;
  platform: string;
  total_capacity: number;
  active_channels: number;
  total_peers: number;
}

interface PrismaChannel {
  remote_pubkey: string;
  remote_alias: string;
  capacity: number;
  last_update: string;
}

interface PrismaHistory {
  date: Date;
  marketCap: number;
}

interface CapacityHistoryEntry {
  date: Date;
  value: number;
}

function transformMCPData(mcpData: MCPData): NetworkStats {
  return {
    totalNodes: mcpData.node_count,
    totalChannels: mcpData.channel_count,
    totalCapacity: mcpData.total_capacity.toString(),
    avgChannelSize: mcpData.avg_capacity.toString(),
    avgCapacityPerChannel: mcpData.avg_capacity,
    avgChannelsPerNode: mcpData.channel_count / mcpData.node_count,
    topNodes: mcpData.top_nodes.map((node) => ({
      publicKey: node.pubkey,
      alias: node.alias,
      color: node.color,
      addresses: node.addresses,
      lastUpdate: new Date(node.last_update),
      capacity: node.capacity,
      channelCount: node.channel_count,
      avgChannelSize: node.avg_channel_size,
      city: node.city,
      country: node.country,
      isp: node.isp,
      platform: node.platform,
    })),
    recentChannels: mcpData.recent_channels.map((channel) => ({
      channelId: channel.channel_id,
      node1Pub: channel.node1_pub,
      node2Pub: channel.node2_pub,
      capacity: channel.capacity,
      lastUpdate: new Date(channel.last_update),
      status: channel.status as "active" | "inactive" | "closed",
    })),
    nodesByCountry: mcpData.nodes_by_country,
    capacityHistory: mcpData.capacity_history.map((entry) => ({
      date: new Date(entry.date),
      value: entry.value,
    })),
  };
}

function transformPrismaNode(node: PrismaNode): NetworkNode {
  return {
    publicKey: node.pubkey,
    alias: node.alias || "",
    color: "#000000",
    addresses: [],
    lastUpdate: new Date(),
    capacity: node.total_capacity,
    channelCount: node.active_channels,
    avgChannelSize:
      node.active_channels > 0 ? node.total_capacity / node.active_channels : 0,
    platform: node.platform || "unknown",
  };
}

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
  const [summary, nodes, capacityHistory] = (await Promise.all([
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
      select: {
        pubkey: true,
        alias: true,
        platform: true,
        total_capacity: true,
        active_channels: true,
        total_peers: true,
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
  ])) as [any, PrismaNode[], PrismaHistory[]];

  const topNodes = nodes.slice(0, 10);
  const recentChannels = nodes.slice(10);

  const countryStats: Record<string, number> = nodes.reduce(
    (acc: Record<string, number>, node: PrismaNode) => {
      const platform = node.platform || "unknown";
      acc[platform] = (acc[platform] || 0) + 1;
      return acc;
    },
    {}
  );

  const capacityHistoryEntries: CapacityHistoryEntry[] = (
    capacityHistory as PrismaHistory[]
  ).map(
    (h: PrismaHistory): CapacityHistoryEntry => ({
      date: h.date,
      value: h.marketCap,
    })
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
    topNodes: topNodes.map((node: PrismaNode) => transformPrismaNode(node)),
    recentChannels: recentChannels.map((node: PrismaNode) => ({
      channelId: node.pubkey,
      node1Pub: "",
      node2Pub: node.pubkey,
      capacity: node.total_capacity,
      lastUpdate: new Date(),
      status: "active" as const,
    })),
    nodesByCountry: countryStats,
    capacityHistory: capacityHistoryEntries,
  };
}

export async function getNetworkSummary(): Promise<NetworkStats> {
  return getNetworkStats();
}

export async function getAllNodes(): Promise<NetworkNode[]> {
  const nodes = await prisma.node.findMany({
    orderBy: { total_capacity: "desc" },
    select: {
      pubkey: true,
      alias: true,
      platform: true,
      total_capacity: true,
      active_channels: true,
      total_peers: true,
    },
  });
  return nodes.map(transformPrismaNode);
}

export async function getPeersOfPeers(pubkey: string) {
  const node = await prisma.node.findUnique({
    where: { pubkey },
    include: { peersOfPeers: true },
  });
  return node?.peersOfPeers || [];
}

export async function getCurrentStats(): Promise<NetworkStats> {
  return getNetworkStats();
}

export async function getHistoricalData() {
  const history = await prisma.history.findMany({
    orderBy: { date: "desc" },
    take: 30,
  });
  return history.map((h) => ({
    date: h.date,
    value: h.marketCap,
  }));
}

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

function transformMCPData(mcpData: MCPData): NetworkStats {
  return {
    totalNodes: mcpData.node_count,
    totalChannels: mcpData.channel_count,
    totalCapacity: mcpData.total_capacity,
    avgCapacityPerChannel: mcpData.avg_capacity,
    avgChannelsPerNode: mcpData.channel_count / mcpData.node_count,
    lastUpdate: new Date(mcpData.timestamp),
    topNodes: [],
    recentChannels: [],
    nodesByCountry: {},
    capacityHistory: [],
  };
}

function transformPrismaNode(node: PrismaNode): NetworkNode {
  return {
    publicKey: node.pubkey,
    alias: node.alias,
    color: "#000000",
    addresses: [],
    lastUpdate: new Date(),
    capacity: node.total_capacity,
    channelCount: node.active_channels,
    avgChannelSize: node.total_capacity / node.active_channels,
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
      cacheStrategy: {
        swr: 300,
        ttl: 900,
        tags: ["capacity_history"],
      },
    }),
  ]);

  const topNodes = nodes.slice(0, 10);
  const recentChannels = nodes.slice(10);

  const countryStats = nodes.reduce<Record<string, number>>((acc, node) => {
    const platform = node.platform || "unknown";
    acc[platform] = (acc[platform] || 0) + 1;
    return acc;
  }, {});

  return {
    totalNodes: summary?.totalNodes || 0,
    totalChannels: summary?.totalChannels || 0,
    totalCapacity: summary?.totalCapacity || 0,
    avgCapacityPerChannel: summary?.avgChannelSize || 0,
    avgChannelsPerNode: summary?.totalChannels
      ? summary.totalChannels / summary.totalNodes
      : 0,
    lastUpdate: summary?.timestamp || new Date(),
    topNodes: topNodes.map((node) => transformPrismaNode(node)),
    recentChannels: recentChannels.map((node) => ({
      channelId: node.pubkey,
      node1Pub: "",
      node2Pub: node.pubkey,
      capacity: node.total_capacity,
      lastUpdate: new Date(),
      status: "active",
    })),
    nodesByCountry: countryStats,
    capacityHistory: capacityHistory.map(
      (h: { date: Date; marketCap: number }) => ({
        date: h.date,
        value: h.marketCap,
      })
    ),
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

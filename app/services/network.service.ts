import { NetworkStats } from "@/app/types/network";
import { connectToDatabase } from "@/app/lib/mongodb";

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

    // Si MCP échoue, utiliser MongoDB
    return await getNetworkStatsFromMongoDB();
  } catch (error) {
    console.error("Error fetching network stats:", error);
    // En dernier recours, utiliser MongoDB
    return await getNetworkStatsFromMongoDB();
  }
}

async function getNetworkStatsFromMongoDB(): Promise<NetworkStats> {
  const { db } = await connectToDatabase();

  const [stats, topNodes, recentChannels, countryStats, capacityHistory] =
    await Promise.all([
      db.collection("network_stats").findOne({}, { sort: { lastUpdate: -1 } }),
      db
        .collection("nodes")
        .find({}, { sort: { capacity: -1 }, limit: 10 })
        .toArray(),
      db
        .collection("channels")
        .find({}, { sort: { lastUpdate: -1 }, limit: 20 })
        .toArray(),
      db
        .collection("nodes")
        .aggregate([{ $group: { _id: "$country", count: { $sum: 1 } } }])
        .toArray(),
      db
        .collection("capacity_history")
        .find(
          {},
          {
            sort: { date: -1 },
            limit: 30,
          }
        )
        .toArray(),
    ]);

  return {
    totalNodes: stats?.totalNodes || 0,
    totalChannels: stats?.totalChannels || 0,
    totalCapacity: stats?.totalCapacity || 0,
    avgCapacityPerChannel: stats?.avgCapacityPerChannel || 0,
    avgChannelsPerNode: stats?.avgChannelsPerNode || 0,
    lastUpdate: stats?.lastUpdate || new Date(),
    topNodes: topNodes.map(transformMongoNode),
    recentChannels: recentChannels.map(transformMongoChannel),
    nodesByCountry: Object.fromEntries(
      countryStats.map((stat) => [stat._id || "unknown", stat.count])
    ),
    capacityHistory: capacityHistory.map((h) => ({
      date: h.date,
      value: h.value,
    })),
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

function transformMongoNode(node: any): NetworkNode {
  return {
    publicKey: node.publicKey,
    alias: node.alias,
    color: node.color,
    addresses: node.addresses || [],
    lastUpdate: node.lastUpdate,
    capacity: node.capacity,
    channelCount: node.channelCount,
    avgChannelSize: node.avgChannelSize,
    city: node.city,
    country: node.country,
    isp: node.isp,
    platform: node.platform,
  };
}

function transformMongoChannel(channel: any): NetworkChannel {
  return {
    channelId: channel.channelId,
    node1Pub: channel.node1Pub,
    node2Pub: channel.node2Pub,
    capacity: channel.capacity,
    lastUpdate: channel.lastUpdate,
    status: channel.status,
  };
}

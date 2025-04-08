import { NetworkStats, NetworkNode, NetworkChannel } from "../types/network";
import { MongoClient, Document } from "mongodb";
import { Schema, model } from "mongoose";
import { connectToDatabase } from "../lib/mongodb";
import Node from "../models/Node";
import History from "../models/History";

interface NetworkData {
  nodes: NetworkNode[];
  channels: NetworkChannel[];
  stats: NetworkStats;
}

interface NetworkResponse {
  success: boolean;
  data?: NetworkData;
  error?: string;
}

interface CapacityHistoryItem {
  date: Date;
  value: number;
}

export interface NetworkStatsDTO {
  timestamp: Date;
  nodeCount: number;
  channelCount: number;
  totalCapacity: string;
  avgChannelSize: string;
  avgCapacityPerChannel: number;
  avgChannelsPerNode: number;
  nodesByCountry: Record<string, number>;
  topNodes: NetworkNode[];
  recentChannels: NetworkChannel[];
  capacityHistory: CapacityHistoryItem[];
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("La variable d'environnement MONGODB_URI est requise");
}

interface MongoNode extends Document {
  public_key: string;
  alias: string;
  color: string;
  addresses: string[];
  last_update: Date;
  capacity: number;
  channel_count: number;
  avg_channel_size: number;
  city?: string;
  country?: string;
  isp?: string;
  platform?: string;
}

interface MongoHistory extends Document {
  date: Date;
  total_capacity: number;
  total_nodes: number;
  total_channels: number;
}

const networkStatsSchema = new Schema({
  timestamp: { type: Date, required: true },
  node_count: { type: Number, required: true },
  channel_count: { type: Number, required: true },
  total_capacity: { type: String, required: true },
  avg_channel_size: { type: String, required: true },
  avg_capacity_per_channel: { type: Number, required: true },
  avg_channels_per_node: { type: Number, required: true },
  nodes_by_country: { type: Map, of: Number },
  top_nodes: [
    {
      pubkey: String,
      alias: String,
      color: String,
      addresses: [String],
      last_update: Date,
      capacity: String,
      channels: Number,
    },
  ],
  recent_channels: [
    {
      channel_id: String,
      capacity: String,
      node1_pub: String,
      node2_pub: String,
      created_at: Date,
      last_update: Date,
      status: String,
    },
  ],
  capacity_history: [
    {
      date: Date,
      value: Number,
    },
  ],
});

const NetworkStatsModel = model("NetworkStats", networkStatsSchema);

class NetworkService {
  private static instance: NetworkService;
  private client: MongoClient;
  private readonly uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  private readonly dbName = "daznode";

  private constructor() {
    this.client = new MongoClient(this.uri);
  }

  public static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }
    return NetworkService.instance;
  }

  private async connect() {
    if (!this.client.connect) {
      await this.client.connect();
    }
  }

  private async disconnect() {
    await this.client.close();
  }

  private transformMongoNode(doc: Document): NetworkNode {
    const node = doc as MongoNode;
    return {
      publicKey: node.public_key,
      alias: node.alias,
      color: node.color,
      addresses: node.addresses,
      lastUpdate: new Date(node.last_update),
      capacity: Number(node.capacity),
      channelCount: Number(node.channel_count),
      avgChannelSize: Number(node.avg_channel_size),
    };
  }

  private getDefaultNetworkStats(): NetworkStatsDTO {
    return {
      timestamp: new Date(),
      nodeCount: 0,
      channelCount: 0,
      totalCapacity: "0",
      avgChannelSize: "0",
      avgCapacityPerChannel: 0,
      avgChannelsPerNode: 0,
      nodesByCountry: {},
      topNodes: [],
      recentChannels: [],
      capacityHistory: [],
    };
  }

  private transformNetworkStats(data: unknown): NetworkStatsDTO {
    const typedData = data as {
      timestamp: Date;
      node_count: number;
      channel_count: number;
      total_capacity: string;
      avg_channel_size: string;
      avg_capacity_per_channel: number;
      avg_channels_per_node: number;
      nodes_by_country: Record<string, number>;
      top_nodes: Array<{
        pubkey: string;
        alias: string;
        color: string;
        addresses: string[];
        last_update: Date;
        capacity: number;
        channels: number;
        avg_channel_size: number;
      }>;
      recent_channels: Array<{
        channel_id: string;
        capacity: number;
        node1_pub: string;
        node2_pub: string;
        last_update: Date;
        status: string;
      }>;
      capacity_history: Array<{
        date: Date;
        value: number;
      }>;
    };

    const transformedTopNodes: NetworkNode[] = (typedData.top_nodes || []).map(
      (node) => ({
        publicKey: node.pubkey,
        alias: node.alias,
        color: node.color || "#000000",
        addresses: node.addresses || [],
        lastUpdate: new Date(node.last_update || Date.now()),
        capacity: node.capacity,
        channelCount: node.channels,
        avgChannelSize: node.avg_channel_size,
      })
    );

    const transformedChannels: NetworkChannel[] = (
      typedData.recent_channels || []
    ).map((channel) => ({
      channelId: channel.channel_id,
      capacity: channel.capacity,
      node1Pub: channel.node1_pub,
      node2Pub: channel.node2_pub,
      lastUpdate: new Date(channel.last_update || Date.now()),
      status: channel.status as "active" | "inactive" | "closed",
    }));

    const transformedCapacityHistory: CapacityHistoryItem[] = (
      typedData.capacity_history || []
    ).map((item) => ({
      date: new Date(item.date),
      value: Number(item.value),
    }));

    return {
      timestamp: typedData.timestamp,
      nodeCount: typedData.node_count,
      channelCount: typedData.channel_count,
      totalCapacity: typedData.total_capacity,
      avgChannelSize: typedData.avg_channel_size,
      avgCapacityPerChannel: typedData.avg_capacity_per_channel,
      avgChannelsPerNode: typedData.avg_channels_per_node,
      nodesByCountry: typedData.nodes_by_country || {},
      topNodes: transformedTopNodes,
      recentChannels: transformedChannels,
      capacityHistory: transformedCapacityHistory,
    };
  }

  public async getNetworkStats(): Promise<NetworkStatsDTO> {
    try {
      const stats = await NetworkStatsModel.findOne().sort({ timestamp: -1 });
      return stats
        ? this.transformNetworkStats(stats)
        : this.getDefaultNetworkStats();
    } catch (error) {
      console.error("Error fetching network stats:", error);
      return this.getDefaultNetworkStats();
    }
  }

  public async saveNetworkStats(stats: NetworkStatsDTO): Promise<void> {
    try {
      const networkStats = new NetworkStatsModel({
        timestamp: stats.timestamp,
        node_count: stats.nodeCount,
        channel_count: stats.channelCount,
        total_capacity: stats.totalCapacity,
        avg_channel_size: stats.avgChannelSize,
        avg_capacity_per_channel: stats.avgCapacityPerChannel,
        avg_channels_per_node: stats.avgChannelsPerNode,
        nodes_by_country: stats.nodesByCountry,
        top_nodes: stats.topNodes.map((node) => ({
          pubkey: node.publicKey,
          alias: node.alias,
          color: node.color,
          addresses: node.addresses,
          last_update: node.lastUpdate,
          capacity: node.capacity,
          channels: node.channelCount,
        })),
        recent_channels: stats.recentChannels.map((channel) => ({
          channel_id: channel.channelId,
          capacity: channel.capacity,
          node1_pub: channel.node1Pub,
          node2_pub: channel.node2Pub,
          last_update: channel.lastUpdate,
          status: channel.status,
        })),
        capacity_history: stats.capacityHistory.map((item) => ({
          date: item.date,
          value: item.value,
        })),
      });
      await networkStats.save();
    } catch (error) {
      console.error("Error saving network stats:", error);
      throw error;
    }
  }

  async getAllNodes(): Promise<NetworkNode[]> {
    try {
      await this.connect();
      const db = this.client.db(this.dbName);
      const nodes = await db.collection("nodes").find().toArray();
      return (nodes as Document[]).map((doc) => this.transformMongoNode(doc));
    } finally {
      await this.disconnect();
    }
  }

  async getNodeByPubkey(pubkey: string): Promise<NetworkNode | null> {
    try {
      await this.connect();
      const db = this.client.db(this.dbName);
      const doc = await db.collection("nodes").findOne({ public_key: pubkey });
      return doc ? this.transformMongoNode(doc) : null;
    } finally {
      await this.disconnect();
    }
  }

  async getCapacityHistory(): Promise<Array<{ date: Date; value: number }>> {
    try {
      await this.connect();
      const db = this.client.db(this.dbName);
      const history = await db
        .collection("history")
        .find()
        .sort({ date: -1 })
        .limit(30)
        .toArray();

      return (history as Document[]).map((doc: Document) => {
        const entry = doc as MongoHistory;
        return {
          date: new Date(entry.date),
          value: Number(entry.total_capacity),
        };
      });
    } finally {
      await this.disconnect();
    }
  }
}

export const networkService = NetworkService.getInstance();

export async function getNetworkSummary(): Promise<NetworkStatsDTO> {
  return networkService.getNetworkStats();
}

export async function getPeersOfPeers(pubkey: string) {
  try {
    await connectToDatabase();
    const node = await Node.findOne({ pubkey }).populate("peersOfPeers");
    return node?.peersOfPeers || [];
  } catch (error) {
    console.error("Error getting peers of peers:", error);
    throw error;
  }
}

export async function getCurrentStats(): Promise<NetworkStatsDTO> {
  return networkService.getNetworkStats();
}

export async function getHistoricalData() {
  const history = await History.find().sort({ date: "desc" }).limit(30);
  return history.map((h: { date: Date; marketCap: number }) => ({
    date: h.date,
    value: Number(h.marketCap),
  }));
}

export async function processNetworkData(_data: NetworkData): Promise<void> {
  // Implémentation à venir
}

export async function validateNetworkResponse(
  response: NetworkResponse
): Promise<boolean> {
  return response.success && !!response.data;
}

export async function getNodeInfo(nodeId: string) {
  try {
    await connectToDatabase();

    const node = await Node.findOne({ nodeId });
    if (!node) {
      throw new Error("Node not found");
    }
    return node;
  } catch (error) {
    console.error("Error getting node info:", error);
    throw error;
  }
}

export async function getNodeHistory(nodeId: string) {
  try {
    await connectToDatabase();

    const history = await History.find({ nodeId })
      .sort({ timestamp: -1 })
      .limit(100);
    return history;
  } catch (error) {
    console.error("Error getting node history:", error);
    throw error;
  }
}

interface History {
  nodes: NetworkNode[];
  channels: NetworkChannel[];
  stats: NetworkStats;
}

function processHistoryData(h: History): NetworkData {
  return {
    nodes: h.nodes || [],
    channels: h.channels || [],
    stats: h.stats || {
      totalCapacity: 0,
      totalChannels: 0,
      averageChannelSize: 0,
      totalFees: 0,
    },
  };
}

import { Document } from "mongoose";

interface ITopNode {
  alias: string;
  pubkey: string;
  capacity: string;
  channels: number;
}

interface IRecentChannel {
  channel_id: string;
  capacity: string;
  node1_pub: string;
  node2_pub: string;
  created_at: Date;
}

interface ICapacityHistory {
  timestamp: Date;
  value: string;
}

export interface INetworkStats extends Document {
  timestamp: Date;
  node_count: number;
  channel_count: number;
  total_capacity: string;
  avg_channel_size: string;
  avg_capacity_per_channel: number;
  avg_channels_per_node: number;
  nodes_by_country: Map<string, number>;
  top_nodes: ITopNode[];
  recent_channels: IRecentChannel[];
  capacity_history: ICapacityHistory[];
}

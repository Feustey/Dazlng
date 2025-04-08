import { Schema, model, models } from "mongoose";

const networkStatsSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  node_count: Number,
  channel_count: Number,
  total_capacity: String,
  avg_channel_size: String,
  avg_capacity_per_channel: Number,
  avg_channels_per_node: Number,
  nodes_by_country: { type: Map, of: Number },
  top_nodes: [
    {
      alias: String,
      pubkey: String,
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
    },
  ],
  capacity_history: [
    {
      timestamp: Date,
      value: String,
    },
  ],
});

export const NetworkStatsModel =
  models.NetworkStats || model("NetworkStats", networkStatsSchema);

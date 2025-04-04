import mongoose from "mongoose";

const nodeStatsSchema = new mongoose.Schema({
  pubkey: String,
  alias: String,
  color: String,
  platform: String,
  version: String,
  address: String,
  total_fees: Number,
  avg_fee_rate_ppm: Number,
  total_capacity: Number,
  active_channels: Number,
  total_volume: Number,
  total_peers: Number,
  uptime: Number,
  opened_channel_count: Number,
  closed_channel_count: Number,
  pending_channel_count: Number,
  avg_capacity: Number,
  avg_fee_rate: Number,
  avg_base_fee_rate: Number,
  betweenness_rank: Number,
  eigenvector_rank: Number,
  closeness_rank: Number,
  weighted_betweenness_rank: Number,
  weighted_closeness_rank: Number,
  weighted_eigenvector_rank: Number,
  last_update: Date,
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.NodeStats ||
  mongoose.model("NodeStats", nodeStatsSchema);

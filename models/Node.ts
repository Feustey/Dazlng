import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  alias: { type: String, required: true },
  pubkey: { type: String, required: true, unique: true },
  platform: { type: String, required: true },
  version: { type: String, required: true },
  total_fees: { type: Number, required: true },
  avg_fee_rate_ppm: { type: Number, required: true },
  total_capacity: { type: Number, required: true },
  active_channel_count: { type: Number, required: true },
  total_volume: { type: Number, required: true },
  total_peers: { type: Number, required: true },
  uptime: { type: Number, required: true },
  opened_channel_count: { type: Number, required: true },
  color: { type: String, required: true },
  address: { type: String, required: true },
  closed_channel_count: { type: Number, required: true },
  pending_channel_count: { type: Number, required: true },
  avg_capacity: { type: Number, required: true },
  avg_fee_rate: { type: Number, required: true },
  avg_base_fee_rate: { type: Number, required: true },
  betweenness_rank: { type: Number, required: true },
  eigenvector_rank: { type: Number, required: true },
  closeness_rank: { type: Number, required: true },
  weighted_betweenness_rank: { type: Number, required: true },
  weighted_closeness_rank: { type: Number, required: true },
  weighted_eigenvector_rank: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Node = mongoose.models.Node || mongoose.model('Node', nodeSchema);

export interface INode {
  _id?: string;
  pubkey: string;
  alias: string;
  platform: string;
  version: string;
  total_fees: number;
  avg_fee_rate_ppm: number;
  total_capacity: number;
  active_channel_count: number;
  total_volume: number;
  total_peers: number;
  uptime: number;
  opened_channel_count: number;
  color: string;
  address: string;
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
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export default Node; 
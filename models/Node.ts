import mongoose from 'mongoose';

const nodeSchema = new mongoose.Schema({
  alias: { type: String, required: true },
  pubkey: { type: String, required: true },
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
  timestamp: { type: Date, default: Date.now }
});

export const Node = mongoose.models.Node || mongoose.model('Node', nodeSchema);

export interface INode {
  alias: string;
  pubkey: string;
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
  timestamp: Date;
} 
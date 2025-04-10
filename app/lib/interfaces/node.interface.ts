import { Document } from "mongoose";

export interface INode extends Document {
  alias: string;
  pubkey: string;
  platform: string;
  version: string;
  total_fees: number;
  avg_fee_rate_ppm: number;
  capacity: number;
  channels: number;
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
  last_update: number;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

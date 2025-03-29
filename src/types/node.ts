export interface BaseNode {
  pubkey: string;
  alias: string;
  platform: string;
  version: string;
  total_fees: number;
  avg_fee_rate_ppm: number;
  total_capacity: number;
  active_channels: number;
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
  timestamp: string | Date;
}

export interface MongoNode extends BaseNode {
  _id?: string;
  active_channel_count: number;
  betweenness_rank: number;
  eigenvector_rank: number;
  closeness_rank: number;
  weighted_betweenness_rank: number;
  weighted_closeness_rank: number;
  weighted_eigenvector_rank: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface McpNode {
  pubkey: string;
  alias?: string;
  capacity?: number;
  channel_count?: number;
  avg_capacity?: number;
  last_update?: string;
  status?: string;
  recommendations?: string[];
} 
export interface Node {
  pubkey: string;
  alias: string;
  capacity: number;
  channels: number;
  last_update: number;
}

export interface NetworkSummary {
  total_nodes: number;
  active_nodes: number;
  total_channels: number;
  active_channels: number;
  total_capacity: number;
  avg_capacity: number;
  avg_fee_rate: number;
  avg_base_fee: number;
  network_growth: {
    nodes: number;
    channels: number;
    capacity: number;
  };
  top_nodes: {
    pubkey: string;
    alias: string;
    capacity: number;
    channels: number;
  }[];
  timestamp: string;
}

export interface NetworkStats {
  total_nodes: number;
  total_channels: number;
  total_capacity: number;
  avg_capacity_per_channel: number;
  avg_channels_per_node: number;
  timestamp: string;
}

export interface HistoricalData {
  dates: string[];
  nodes: number[];
  channels: number[];
  capacity: number[];
}

export interface CentralityNode {
  pubkey: string;
  value: number;
  rank: number;
}

export interface Centralities {
  betweenness: CentralityNode[];
  eigenvector: CentralityNode[];
  closeness: CentralityNode[];
  weighted_betweenness: CentralityNode[];
  weighted_eigenvector: CentralityNode[];
  weighted_closeness: CentralityNode[];
  last_update: string;
}

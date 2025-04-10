import { INode } from "../lib/interfaces/node.interface";

export type Node = INode;

export interface NetworkSummaryData {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgCapacityPerChannel: number;
  avgChannelsPerNode: number;
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

export interface NodeCentrality {
  pubkey: string;
  betweenness: number;
  closeness: number;
  eigenvector: number;
  degree: number;
  capacity: number;
  channels: number;
  avg_fee_rate: number;
  avg_base_fee: number;
  last_update: string;
  growth_rate: number;
}

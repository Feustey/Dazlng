import { INode } from "@/lib/interfaces/node.interface";

export interface Node {
  pubkey: string;
  alias: string;
  color?: string;
  last_update?: number;
  addresses?: string[];
  features?: any;
}

export interface NetworkSummary {
  nodes: number;
  channels: number;
  capacity: number;
  avg_capacity_per_channel: number;
  avg_channels_per_node: number;
  last_updated: string;
}

export interface NetworkSummaryData {
  stats: NetworkSummary;
  timestamp: string;
}

export interface NetworkStats {
  nodes_count: number;
  channels_count: number;
  total_capacity: number;
  avg_capacity_per_channel: number;
  avg_channels_per_node: number;
  network_diameter: number;
  avg_path_length: number;
}

export interface Centralities {
  betweenness: NodeCentrality[];
  degree: NodeCentrality[];
  eigenvector: NodeCentrality[];
  weighted_betweenness: NodeCentrality[];
  weighted_degree: NodeCentrality[];
  weighted_eigenvector: NodeCentrality[];
  last_update: string;
}

export interface NodeCentrality {
  pubkey: string;
  value: number;
  rank: number;
}

export interface CentralityNode {
  pubkey: string;
  alias: string;
  betweenness: number;
  degree: number;
  eigenvector: number;
  weighted_betweenness: number;
  weighted_degree: number;
  weighted_eigenvector: number;
  channels_count: number;
  capacity: number;
}

export interface HistoricalData {
  periods: {
    date: string;
    nodes_count: number;
    channels_count: number;
    total_capacity: number;
    avg_capacity_per_channel: number;
    avg_channels_per_node: number;
  }[];
  resolution: "hourly" | "daily" | "weekly" | "monthly";
  timespan: number;
  last_update: string;
}

export interface NodeGrowthPrediction {
  pubkey: string;
  timeframe: "7d" | "30d" | "90d";
  metrics: {
    capacity: number[];
    channels: number[];
    fees: number[];
    dates: string[];
  };
  confidence: number;
  trends: {
    capacityGrowth: number;
    channelGrowth: number;
    feeRevenue: number;
  };
  recommendations: string[];
  timestamp: string;
}

export interface NetworkTrendsPrediction {
  timeframe: "7d" | "30d" | "90d";
  metrics: {
    capacity: number[];
    channels: number[];
    fees: number[];
    dates: string[];
  };
  confidence: number;
  trends: {
    capacityGrowth: number;
    nodesGrowth: number;
    channelsGrowth: number;
    avgFeeRate: number;
  };
  hotspots: {
    pubkey: string;
    alias: string;
    growth: number;
  }[];
  timestamp: string;
}

export interface FeeMarketAnalysis {
  average: {
    base_fee: number;
    fee_rate: number;
  };
  distribution: {
    ranges: {
      min: number;
      max: number;
      count: number;
    }[];
    percentiles: {
      p10: number;
      p25: number;
      p50: number;
      p75: number;
      p90: number;
    };
  };
  recommendations: {
    low: number;
    medium: number;
    high: number;
  };
  timestamp: string;
}

import { Node, NetworkSummary } from "./node";

export interface NodeStats {
  totalCapacity: number;
  numberOfChannels: number;
  averageChannelSize: number;
  totalFees: number;
  uptime: number;
}

export interface PeerOfPeer {
  pubkey: string;
  alias: string;
  capacity: number;
  numberOfChannels: number;
  lastUpdate: string;
}

export interface CentralityData {
  betweenness: number;
  closeness: number;
  degree: number;
  eigenvector: number;
}

export interface OptimizationResult {
  suggestedPeers: string[];
  expectedImprovement: number;
  currentScore: number;
  potentialScore: number;
  recommendations: string[];
}

export interface NodeInfo {
  pubkey: string;
  alias: string;
  color: string;
  addresses: string[];
  lastUpdate: string;
  features: {
    [key: string]: {
      name: string;
      isRequired: boolean;
      isKnown: boolean;
    };
  };
}

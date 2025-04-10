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

// Nouvelles interfaces pour la visualisation du graphe réseau
export interface NetworkGraphNode {
  id: string;
  pubkey: string;
  alias: string;
  color: string;
  capacity: number;
  channels: number;
  coordinates?: [number, number]; // Coordonnées [x, y] pour la visualisation
  group?: number; // Groupe pour le clustering
}

export interface NetworkGraphEdge {
  id: string;
  source: string;
  target: string;
  capacity: number;
  direction: "bi" | "out" | "in";
  status: "active" | "inactive" | "pending";
  age: number; // En jours
  fee_rate: number;
  base_fee: number;
}

export interface NetworkGraph {
  nodes: NetworkGraphNode[];
  edges: NetworkGraphEdge[];
  timestamp: string;
  metrics: {
    density: number;
    diameter: number;
    averagePathLength: number;
    clusteringCoefficient: number;
  };
}

export interface NetworkTopology {
  communities: {
    id: number;
    nodes: string[];
    density: number;
    internalEdges: number;
    externalEdges: number;
  }[];
  bridges: {
    edge_id: string;
    source: string;
    target: string;
    importance: number;
  }[];
  hubs: {
    node_id: string;
    degree: number;
    betweenness: number;
  }[];
  timestamp: string;
}

// Interfaces pour les prédictions
export interface PredictionMetrics {
  capacity: number[];
  channels: number[];
  fees: number[];
  dates: string[];
}

export interface NodeGrowthPrediction {
  pubkey: string;
  timeframe: "7d" | "30d" | "90d";
  metrics: PredictionMetrics;
  confidence: number;
  trends: {
    capacityGrowth: number; // En pourcentage
    channelGrowth: number; // En pourcentage
    feeRevenue: number; // En sats
  };
  recommendations: string[];
  timestamp: string;
}

export interface NetworkTrendsPrediction {
  timeframe: "7d" | "30d" | "90d";
  metrics: PredictionMetrics;
  confidence: number;
  trends: {
    capacityGrowth: number; // En pourcentage
    nodesGrowth: number; // En pourcentage
    channelsGrowth: number; // En pourcentage
    avgFeeRate: number; // En ppm
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

// Interfaces pour la simulation
export interface SimulationResult {
  id: string;
  scenario: string;
  params: any;
  results: {
    networkImpact: number; // En pourcentage
    affectedNodes: string[];
    affectedChannels: string[];
    metrics: {
      beforeSimulation: {
        successRate: number;
        avgFee: number;
        avgPathLength: number;
      };
      afterSimulation: {
        successRate: number;
        avgFee: number;
        avgPathLength: number;
      };
    };
  };
  recommendations: string[];
  timestamp: string;
}

// Interfaces pour les alertes et le monitoring
export interface Alert {
  id: string;
  type: "info" | "warning" | "error" | "success";
  title: string;
  message: string;
  source: {
    type: "node" | "channel" | "network" | "system";
    id?: string;
  };
  timestamp: string;
  isRead: boolean;
  data?: any;
}

export interface AlertConfig {
  type: string;
  conditions: {
    metric: string;
    operator: ">" | "<" | "==" | ">=" | "<=";
    value: number;
  }[];
  actions: {
    type: "notification" | "email" | "webhook";
    config: any;
  }[];
  enabled: boolean;
}

export interface NetworkEvent {
  id: string;
  type: string;
  data: any;
  timestamp: string;
  source: {
    type: "node" | "channel" | "network" | "system";
    id?: string;
  };
}

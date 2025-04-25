import { Node, NetworkSummary } from "./node";

export interface NodeStats {
  capacity: number;
  channels: number;
  avgChannelSize: number;
  lastSeen: number;
  uptime: number;
  availability: number;
  fees: {
    base: number;
    rate: number;
    avgFee: number;
  };
  bandwidth: {
    in: number;
    out: number;
    total: number;
  };
}

export interface PeerOfPeer {
  pubkey: string;
  alias: string;
  channels: number;
  capacity: number;
  distance: number;
}

export interface CentralityData {
  betweenness: number;
  closeness: number;
  degree: number;
  eigenvector: number;
  rank: number;
  percentile: number;
}

export interface OptimizationResult {
  suggestedActions: Array<{
    type: "open" | "close" | "rebalance";
    description: string;
    targetNode?: string;
    amount?: number;
    fee?: number;
    expectedBenefit: number;
    risk: "low" | "medium" | "high";
  }>;
  potentialRevenueIncrease: number;
  potentialRoutingIncrease: number;
}

export interface NodeInfo {
  pubkey: string;
  alias: string;
  color: string;
  capacity: number;
  channels: number;
  firstSeen: string;
  updated: string;
  fee: {
    base: number;
    rate: number;
  };
  uptime: number;
  location?: {
    country: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
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
  alias: string;
  currentCapacity: number;
  currentChannels: number;
  predictions: {
    capacity: {
      predicted: number;
      percentChange: number;
      confidence: number;
    };
    channels: {
      predicted: number;
      percentChange: number;
      confidence: number;
    };
    centrality: {
      current: number;
      predicted: number;
      percentChange: number;
    };
  };
  timeframe: "7d" | "30d" | "90d";
  factors: {
    name: string;
    impact: "high" | "medium" | "low";
    description: string;
  }[];
}

export interface NetworkTrendsPrediction {
  timeframe: "7d" | "30d" | "90d";
  totalCapacity: {
    current: number;
    predicted: number;
    percentChange: number;
  };
  totalNodes: {
    current: number;
    predicted: number;
    percentChange: number;
  };
  totalChannels: {
    current: number;
    predicted: number;
    percentChange: number;
  };
  avgChannelSize: {
    current: number;
    predicted: number;
    percentChange: number;
  };
  trends: {
    name: string;
    description: string;
    confidence: number;
  }[];
  hotspots: {
    region: string;
    growth: number;
    activity: "high" | "medium" | "low";
  }[];
}

export interface FeeMarketAnalysis {
  avgBaseFee: number;
  avgFeeRate: number;
  feeDistribution: {
    low: {
      count: number;
      percentage: number;
      avgRate: number;
    };
    medium: {
      count: number;
      percentage: number;
      avgRate: number;
    };
    high: {
      count: number;
      percentage: number;
      avgRate: number;
    };
  };
  recommendations: {
    baseFee: {
      min: number;
      max: number;
      optimal: number;
    };
    feeRate: {
      min: number;
      max: number;
      optimal: number;
    };
  };
  competitiveAnalysis: {
    position: "low" | "average" | "high";
    percentile: number;
  };
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

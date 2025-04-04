export interface NodeInfo {
  last_update: number;
  pub_key: string;
  alias: string;
  addresses: {
    network: string;
    addr: string;
  }[];
  color: string;
  capacity: number;
  channelcount: number;
  noderank: {
    capacity: number;
    channelcount: number;
    age: number;
    growth: number;
    availability: number;
  };
  channelCount: number;
  avgCapacity: number;
  betweenness: number;
  closeness: number;
  eigenvector: number;
  feeRates: {
    average: number;
    min: number;
    max: number;
  };
  channelStats: {
    opened: number;
    active: number;
    inactive: number;
  };
  financialMetrics: {
    totalCapacity: number;
    totalFees: number;
    avgFeesPerChannel: number;
  };
  centralities: {
    betweenness: number;
    closeness: number;
    eigenvector: number;
  };
}

export interface NodeHistoryEntry extends NodeInfo {
  timestamp: Date;
}

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
}

export interface NodeHistoryEntry extends NodeInfo {
  timestamp: Date;
} 
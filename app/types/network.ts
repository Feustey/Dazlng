export interface NetworkNode {
  publicKey: string;
  alias: string;
  color: string;
  addresses: string[];
  lastUpdate: Date;
  capacity: number;
  channelCount: number;
  avgChannelSize: number;
  city?: string;
  country?: string;
  isp?: string;
  platform?: string;
}

export interface NetworkChannel {
  channelId: string;
  node1Pub: string;
  node2Pub: string;
  capacity: number;
  lastUpdate: Date;
  status: "active" | "inactive" | "closed";
}

export interface NetworkStats {
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgCapacityPerChannel: number;
  avgChannelsPerNode: number;
  lastUpdate: Date;
  topNodes: NetworkNode[];
  recentChannels: NetworkChannel[];
  nodesByCountry: Record<string, number>;
  capacityHistory: Array<{
    date: Date;
    value: number;
  }>;
}

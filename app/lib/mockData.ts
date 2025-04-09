import { NetworkStatsDTO } from "../services/network.service";

export const mockNetworkStats: NetworkStatsDTO = {
  timestamp: new Date(),
  nodeCount: 15000,
  channelCount: 85000,
  totalCapacity: "5000000000",
  avgChannelSize: "58823",
  avgCapacityPerChannel: 58823,
  avgChannelsPerNode: 5.67,
  nodesByCountry: {},
  topNodes: [],
  recentChannels: [],
  capacityHistory: [],
};

export const mockNetworkSummary = {
  ...mockNetworkStats,
  version: "1.0.0",
};

export const mockHistoricalData = {
  nodes: [
    { date: "2024-01-01", value: 14000 },
    { date: "2024-02-01", value: 14500 },
    { date: "2024-03-01", value: 15000 },
  ],
  channels: [
    { date: "2024-01-01", value: 80000 },
    { date: "2024-02-01", value: 82500 },
    { date: "2024-03-01", value: 85000 },
  ],
  capacity: [
    { date: "2024-01-01", value: 4500000000 },
    { date: "2024-02-01", value: 4750000000 },
    { date: "2024-03-01", value: 5000000000 },
  ],
};

import { prisma } from "../db";

export interface IPeerOfPeer {
  id?: string;
  nodePubkey: string;
  peerPubkey: string;
  alias: string;
  platform: string;
  version: string;
  total_fees: number;
  avg_fee_rate_ppm: number;
  total_capacity: number;
  active_channels: number;
  total_volume: number;
  total_peers: number;
  uptime: number;
  opened_channel_count: number;
  color: string;
  address: string;
  closed_channel_count: number;
  pending_channel_count: number;
  avg_capacity: number;
  avg_fee_rate: number;
  avg_base_fee_rate: number;
  betweenness_rank: number;
  eigenvector_rank: number;
  closeness_rank: number;
  weighted_betweenness_rank: number;
  weighted_closeness_rank: number;
  weighted_eigenvector_rank: number;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const PeerOfPeer = {
  create: async (data: IPeerOfPeer) => {
    return prisma.peerOfPeer.create({
      data,
    });
  },

  createMany: async (data: IPeerOfPeer[]) => {
    return prisma.peerOfPeer.createMany({
      data,
    });
  },

  findMany: async (where?: any, orderBy?: any, take?: number) => {
    return prisma.peerOfPeer.findMany({
      where,
      orderBy,
      take,
    });
  },

  deleteMany: async (where: any) => {
    return prisma.peerOfPeer.deleteMany({
      where,
    });
  },
};

export default PeerOfPeer;

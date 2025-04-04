import { prisma } from "../db";

export interface INode {
  id?: string;
  pubkey: string;
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

export const Node = {
  create: async (data: INode) => {
    return prisma.node.create({
      data,
    });
  },

  findOne: async (where: { pubkey: string }) => {
    return prisma.node.findUnique({
      where,
    });
  },

  findMany: async (where?: any, orderBy?: any, take?: number) => {
    return prisma.node.findMany({
      where,
      orderBy,
      take,
    });
  },

  update: async (where: { pubkey: string }, data: Partial<INode>) => {
    return prisma.node.update({
      where,
      data,
    });
  },

  upsert: async (
    where: { pubkey: string },
    create: INode,
    update: Partial<INode>
  ) => {
    return prisma.node.upsert({
      where,
      create,
      update,
    });
  },

  deleteMany: async (where: any) => {
    return prisma.node.deleteMany({
      where,
    });
  },
};

export default Node;

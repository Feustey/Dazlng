import { prisma } from "../db";

export interface INodeStats {
  id?: string;
  nodePubkey: string;
  channelCount: number;
  capacity: number;
  feeRate: number;
  uptime: number;
  timestamp: Date;
}

export const NodeStats = {
  create: async (data: INodeStats) => {
    return prisma.nodeStats.create({
      data,
    });
  },

  findMany: async (where?: any, orderBy?: any, take?: number) => {
    return prisma.nodeStats.findMany({
      where,
      orderBy,
      take,
    });
  },

  deleteMany: async (where: any) => {
    return prisma.nodeStats.deleteMany({
      where,
    });
  },
};

export default NodeStats;

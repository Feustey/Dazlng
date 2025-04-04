import { prisma } from "../db";

export interface INetworkSummary {
  id?: string;
  totalNodes: number;
  totalChannels: number;
  totalCapacity: number;
  avgChannelSize: number;
  medianFeeRate: number;
  timestamp: Date;
}

export const NetworkSummary = {
  create: async (data: INetworkSummary) => {
    return prisma.networkSummary.create({
      data,
    });
  },

  findMany: async (where?: any, orderBy?: any, take?: number) => {
    return prisma.networkSummary.findMany({
      where,
      orderBy,
      take,
    });
  },

  deleteMany: async (where: any) => {
    return prisma.networkSummary.deleteMany({
      where,
    });
  },
};

export default NetworkSummary;

import { prisma } from "../db";

export interface ICentralityData {
  id?: string;
  nodePubkey: string;
  metric: string;
  value: number;
  timestamp: Date;
}

export const CentralityData = {
  create: async (data: ICentralityData) => {
    return prisma.centralityData.create({
      data,
    });
  },

  findMany: async (where?: any, orderBy?: any, take?: number) => {
    return prisma.centralityData.findMany({
      where,
      orderBy,
      take,
    });
  },

  deleteMany: async (where: any) => {
    return prisma.centralityData.deleteMany({
      where,
    });
  },
};

export default CentralityData;

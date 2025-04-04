import { prisma } from "../db";

export interface IHistory {
  id?: string;
  date: Date;
  price: number;
  volume: number;
  marketCap: number;
  createdAt: Date;
  updatedAt: Date;
}

export const History = {
  create: async (data: IHistory) => {
    return prisma.history.create({
      data,
    });
  },

  findMany: async (where?: any, orderBy?: any, take?: number) => {
    return prisma.history.findMany({
      where,
      orderBy,
      take,
    });
  },

  deleteMany: async (where: any) => {
    return prisma.history.deleteMany({
      where,
    });
  },
};

export default History;

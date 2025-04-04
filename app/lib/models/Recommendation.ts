import { prisma } from "../db";

export interface IRecommendation {
  id?: string;
  nodePubkey: string;
  type: string;
  content: string;
  priority: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export const Recommendation = {
  create: async (data: IRecommendation) => {
    return prisma.recommendation.create({
      data,
    });
  },

  findMany: async (where?: any, orderBy?: any, take?: number) => {
    return prisma.recommendation.findMany({
      where,
      orderBy,
      take,
    });
  },

  update: async (where: { id: string }, data: Partial<IRecommendation>) => {
    return prisma.recommendation.update({
      where,
      data,
    });
  },

  deleteMany: async (where: any) => {
    return prisma.recommendation.deleteMany({
      where,
    });
  },
};

export default Recommendation;

import { prisma } from "../db";

export const Session = {
  create: async (data: {
    sessionId: string;
    email: string;
    expiresAt: Date;
  }) => {
    return prisma.session.create({
      data,
    });
  },

  findOne: async (where: {
    sessionId: string;
    expiresAt?: {
      gt: Date;
    };
  }) => {
    return prisma.session.findFirst({
      where,
    });
  },

  deleteOne: async (where: { sessionId: string }) => {
    return prisma.session.delete({
      where,
    });
  },
};

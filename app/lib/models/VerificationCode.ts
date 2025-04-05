import { prisma } from "../db";

export const VerificationCode = {
  create: async (data: { email: string; code: string; expiresAt: Date }) => {
    return prisma.verificationCode.create({
      data,
    });
  },

  findOne: async (where: {
    email: string;
    code?: string;
    expiresAt?: {
      gt: Date;
    };
  }) => {
    return prisma.verificationCode.findFirst({
      where,
    });
  },

  deleteOne: async (where: { id: string }) => {
    return prisma.verificationCode.delete({
      where,
    });
  },
};

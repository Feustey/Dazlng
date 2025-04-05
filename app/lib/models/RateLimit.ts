import prisma from "../prisma";

interface RateLimitData {
  id: string;
  ip: string;
  route: string;
  count: number;
  resetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class RateLimit {
  static async create(
    data: Omit<RateLimitData, "id" | "createdAt" | "updatedAt">
  ) {
    return await prisma.rateLimit.create({
      data,
    });
  }

  static async findOne(where: { ip: string; route: string }) {
    return await prisma.rateLimit.findFirst({
      where,
    });
  }

  static async update(id: string, data: Partial<RateLimitData>) {
    return await prisma.rateLimit.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    return await prisma.rateLimit.delete({
      where: { id },
    });
  }

  static async cleanup(): Promise<void> {
    await prisma.rateLimit.deleteMany({
      where: {
        resetAt: {
          lt: new Date(),
        },
      },
    });
  }
}

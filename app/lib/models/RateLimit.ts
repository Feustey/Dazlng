import { prisma } from "../prisma";

export interface RateLimitData {
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
  ): Promise<RateLimitData> {
    return prisma.rateLimit.create({
      data,
    });
  }

  static async findByIpAndRoute(
    ip: string,
    route: string
  ): Promise<RateLimitData | null> {
    return prisma.rateLimit.findFirst({
      where: {
        ip,
        route,
      },
    });
  }

  static async update(
    id: string,
    data: Partial<Omit<RateLimitData, "id" | "createdAt" | "updatedAt">>
  ): Promise<RateLimitData> {
    return prisma.rateLimit.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string): Promise<RateLimitData> {
    return prisma.rateLimit.delete({
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

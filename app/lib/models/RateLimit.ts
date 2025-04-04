import { prisma } from "../prisma";
import type { RateLimit as PrismaRateLimit } from "@prisma/client";

export type RateLimitData = PrismaRateLimit;

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
    const result = await prisma.$queryRaw<RateLimitData[]>`
      SELECT * FROM "RateLimit"
      WHERE ip = ${ip} AND route = ${route}
      LIMIT 1
    `;
    return result[0] || null;
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

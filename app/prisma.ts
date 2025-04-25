import { PrismaClient } from "@prisma/client";

// PrismaClient est attaché au scope global pour éviter les connexions multiples en mode development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

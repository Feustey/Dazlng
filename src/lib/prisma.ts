import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: ['query', 'error', 'warn', 'info'],
  datasources: {
    db: {
      url: process.env.MONGODB_URI
    }
  }
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export async function testConnection() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI n\'est pas définie');
    }
    
    console.log('Tentative de connexion à MongoDB...');
    await prisma.$connect();
    console.log('Connexion à MongoDB réussie');
    return true;
  } catch (error) {
    console.error('Erreur de connexion à MongoDB:', error);
    if (error instanceof Error) {
      console.error('Message d\'erreur:', error.message);
    }
    return false;
  }
} 
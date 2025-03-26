import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  const url = process.env.MONGODB_URI;
  console.log('URL de connexion MongoDB:', url);
  
  if (!url) {
    throw new Error('L\'URL de connexion MongoDB n\'est pas définie');
  }

  return new PrismaClient({
    log: ['query', 'error', 'warn', 'info'],
    datasources: {
      db: {
        url: url
      }
    }
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Fonction pour tester la connexion
export async function testConnection() {
  try {
    console.log('Tentative de connexion à la base de données...');
    await prisma.$connect();
    console.log('Connexion à la base de données réussie');
    
    // Test de la collection
    const count = await prisma.history.count();
    console.log(`Nombre d'entrées dans la collection history: ${count}`);
    
    return true;
  } catch (error) {
    console.error('Erreur de connexion à la base de données:', error);
    return false;
  }
} 
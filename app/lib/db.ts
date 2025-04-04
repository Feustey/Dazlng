import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  var prisma: PrismaClient | undefined;
}

// Configuration optimisée du pool de connexions avec IP statiques
const prismaClientSingleton = () => {
  return new PrismaClient({
    // Configuration du timeout du pool de connexions (20 secondes)
    // Cela permet d'attendre plus longtemps une connexion disponible en cas de charge élevée
    datasources: {
      db: {
        // Utilisation des IP statiques de Prisma Accelerate
        url: process.env.DATABASE_URL + "?pool_timeout=20&connection_limit=10",
      },
    },
  }).$extends(withAccelerate());
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

export async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log(
      "Connecté à la base de données avec Prisma Accelerate (IP statiques)"
    );

    // Configuration des limites de requêtes
    await prisma.$executeRaw`
      SET statement_timeout = '10s';  -- Timeout global de 10 secondes
      SET idle_in_transaction_session_timeout = '15s';  -- Timeout des transactions de 15 secondes
    `;

    console.log("Configuration du pool de connexions terminée");
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    throw error;
  }
}

// Fonction pour surveiller l'état du pool de connexions
export async function monitorConnectionPool() {
  try {
    const result = await prisma.$queryRaw`
      SELECT count(*) as active_connections 
      FROM pg_stat_activity 
      WHERE state = 'active'
    `;
    console.log("Connexions actives:", result[0].active_connections);
    return result[0].active_connections;
  } catch (error) {
    console.error("Erreur lors de la surveillance du pool:", error);
    return null;
  }
}

export async function invalidateCache(tags: string[]) {
  try {
    await prisma.$accelerate.invalidate({ tags });
    console.log(`Cache invalidé pour les tags: ${tags.join(", ")}`);
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P6003") {
      console.log(
        "Limite d'invalidation du cache atteinte. Réessayez plus tard."
      );
    } else {
      console.error("Erreur lors de l'invalidation du cache:", error);
    }
    throw error;
  }
}

export async function invalidateAllCache() {
  try {
    await prisma.$accelerate.invalidateAll();
    console.log("Cache global invalidé");
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "P6003") {
      console.log(
        "Limite d'invalidation du cache atteinte. Réessayez plus tard."
      );
    } else {
      console.error("Erreur lors de l'invalidation du cache:", error);
    }
    throw error;
  }
}

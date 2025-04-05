import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

declare global {
  // eslint-disable-next-line no-var
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: ["error", "warn", "info"],
  });

  return client.$extends(withAccelerate());
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) {
    console.log("Déjà connecté à la base de données");
    return;
  }

  try {
    await prisma.$connect();
    isConnected = true;
    console.log("Connecté à la base de données avec Prisma Accelerate");

    // Configuration des limites de requêtes
    await prisma.$executeRaw`
      SET statement_timeout = '30s';
      SET idle_in_transaction_session_timeout = '30s';
      SET lock_timeout = '10s';
    `;

    console.log("Configuration du pool de connexions terminée");
  } catch (error) {
    console.error("Erreur de connexion à la base de données:", error);
    isConnected = false;
    throw error;
  }
}

export async function disconnectFromDatabase() {
  if (!isConnected) {
    return;
  }

  try {
    await prisma.$disconnect();
    isConnected = false;
    console.log("Déconnecté de la base de données");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
}

// Fonction pour vérifier l'état de la connexion
export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Erreur lors de la vérification de la connexion:", error);
    return false;
  }
}

// Fonction pour surveiller l'état du pool de connexions
export async function monitorConnectionPool() {
  try {
    const result = await prisma.$queryRaw`
      SELECT count(*) as active_connections 
      FROM pg_stat_activity 
      WHERE state = 'active';
    `;
    console.log("État du pool de connexions:", result);
    return result;
  } catch (error) {
    console.error("Erreur lors de la surveillance du pool:", error);
    throw error;
  }
}

export async function invalidateCache(tags: string[]) {
  try {
    await (prisma as any).$accelerate.invalidate({ tags });
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
    await (prisma as any).$accelerate.invalidateAll();
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

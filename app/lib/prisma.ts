"use client";

import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Fonction pour tester la connexion
export async function testConnection() {
  try {
    console.log("Début du test de connexion à la base de données...");

    // Test de la connexion
    await prisma.$connect();
    console.log("✓ Connexion à la base de données réussie");

    // Test de la collection history
    const count = await prisma.history.count();
    console.log(`✓ Collection history accessible: ${count} entrées trouvées`);

    // Test de la collection node
    const nodeCount = await prisma.node.count();
    console.log(`✓ Collection node accessible: ${nodeCount} entrées trouvées`);

    return true;
  } catch (error) {
    console.error("❌ ERREUR lors du test de connexion:", error);
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      console.error("Stack trace:", error.stack);
    }
    return false;
  }
}

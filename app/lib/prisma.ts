"use client";

import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

type PrismaClientWithAccelerate = ReturnType<typeof prismaClientSingleton>;

declare global {
  var prisma: PrismaClientWithAccelerate | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

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

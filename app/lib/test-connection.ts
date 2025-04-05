import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

async function testPrismaConnection() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.PRISMA_ACCELERATE_URL,
      },
    },
  }).$extends(withAccelerate());

  try {
    console.log("Test de connexion à Prisma Accelerate...");
    await prisma.$connect();
    console.log("Connexion réussie !");

    // Test de la collection history
    const count = await prisma.history.count();
    console.log(`Nombre d'entrées dans history: ${count}`);

    // Test de la collection node
    const nodeCount = await prisma.node.count();
    console.log(`Nombre d'entrées dans node: ${nodeCount}`);

    return true;
  } catch (error) {
    console.error("Erreur de connexion:", error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaConnection();

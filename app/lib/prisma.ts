import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  const url = process.env.MONGODB_URI;
  console.log("Tentative de connexion à MongoDB...");
  console.log(
    "URL de connexion MongoDB:",
    url ? url.replace(/\/\/[^:]+:[^@]+@/, "//***:***@") : "non définie"
  );

  if (!url) {
    console.error(
      "ERREUR: L'URL de connexion MongoDB n'est pas définie dans les variables d'environnement"
    );
    throw new Error("L'URL de connexion MongoDB n'est pas définie");
  }

  try {
    const client = new PrismaClient({
      log: ["query", "error", "warn", "info"],
      datasources: {
        db: {
          url: url,
        },
      },
    });

    // Test immédiat de la connexion
    client
      .$connect()
      .then(() => console.log("Connexion à MongoDB établie avec succès"))
      .catch((error) => {
        console.error("ERREUR lors de la connexion initiale:", error);
        throw error;
      });

    return client;
  } catch (error) {
    console.error("ERREUR lors de la création du client Prisma:", error);
    throw error;
  }
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

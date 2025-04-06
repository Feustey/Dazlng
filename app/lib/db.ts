import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = () => {
  return new PrismaClient().$extends(withAccelerate());
};

declare global {
  var prisma: ReturnType<typeof prismaClientSingleton> | undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;

// Fonction pour vérifier la connexion à la base de données
export const checkDatabaseConnection = async () => {
  try {
    await prisma.$connect();
    return true;
  } catch (err) {
    const error =
      err instanceof Error
        ? err
        : new Error("Une erreur inconnue s'est produite");
    console.error("Erreur de connexion à la base de données:", error);
    return false;
  }
};

// Fonction pour se connecter à la base de données
export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
    return prisma;
  } catch (err) {
    const error =
      err instanceof Error
        ? err
        : new Error("Une erreur inconnue s'est produite");
    console.error("Erreur de connexion à la base de données:", error);
    throw error;
  }
};

export { prisma };
export default prisma;

// Module minimal mongodb.ts pour éviter l'erreur de build

export const connectToDatabase = async () => {
  try {
    return { db: null };
  } catch (error) {
    console.error("Erreur de connexion à MongoDB", error);
    throw error;
  }
};

export const getCollection = (collectionName: string) => {
  return null;
};

export default { connectToDatabase, getCollection };

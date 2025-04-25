import { NextResponse } from "next/server";
import { Headers } from "next/dist/compiled/@edge-runtime/primitives";

// Simulations pour le déploiement
const auth = async () => {
  // Simuler une session d'utilisateur
  return {
    user: {
      id: "simulated-user-id",
      name: "User Simulé",
      email: "user@example.com",
    },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
  };
};

const getCurrentUser = async () => {
  return {
    id: "simulated-user-id",
    name: "User Simulé",
    email: "user@example.com",
  };
};

// Service de chat simulé
const chatRouter = {
  createCaller: ({ session, headers }: any) => ({
    sendMessage: async (body: any) => {
      // Simuler une réponse du chatbot
      return {
        id: "msg-" + Date.now(),
        content: `Réponse simulée au message: "${body.message}"`,
        timestamp: new Date().toISOString(),
        sender: "bot",
      };
    },
  }),
};

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const headers = req.headers;
    const user = await getCurrentUser();
    const body = await req.json();

    const result = await chatRouter
      .createCaller({ session, headers })
      .sendMessage(body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erreur lors du traitement de la requête:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

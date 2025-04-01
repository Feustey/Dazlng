import { NextResponse } from "next/server";
import { prisma, testConnection } from "@/lib/prisma";

export async function GET() {
  try {
    console.log("Début de la requête GET /api/history");

    // Test de la connexion
    const isConnected = await testConnection();
    if (!isConnected) {
      console.error("Échec de la connexion à la base de données");
      return NextResponse.json(
        { error: "Impossible de se connecter à la base de données" },
        { status: 500 }
      );
    }

    console.log("Récupération de l'historique...");
    const history = await prisma.history.findMany({
      orderBy: {
        date: "desc",
      },
      take: 30, // Limite aux 30 derniers jours
    });

    console.log(`${history.length} entrées d'historique récupérées`);
    return NextResponse.json(history);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'historique:", error);

    // Vérification du type d'erreur
    if (error instanceof Error) {
      console.error("Message d'erreur:", error.message);
      if (error.message.includes("empty database name")) {
        return NextResponse.json(
          {
            error:
              "Erreur de configuration de la base de données. Vérifiez l'URL de connexion MongoDB.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erreur lors de la récupération de l'historique" },
      { status: 500 }
    );
  }
}

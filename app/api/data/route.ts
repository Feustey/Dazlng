import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  try {
    await connectToDatabase();

    let data = {};

    switch (type) {
      case "stats":
        // Récupérer les statistiques depuis la base de données
        // Exemple: const stats = await Stats.find();
        data = { stats: { users: 100, nodes: 50, transactions: 1000 } };
        break;

      case "profile":
        // Récupérer les données de profil, potentiellement avec un ID
        const userId = url.searchParams.get("userId");
        data = { profile: { id: userId, name: "Utilisateur", role: "Admin" } };
        break;

      case "nodes":
        // Récupérer la liste des nœuds
        data = {
          nodes: [
            { id: 1, name: "Node 1" },
            { id: 2, name: "Node 2" },
          ],
        };
        break;

      default:
        return NextResponse.json(
          { error: "Type de données non spécifié" },
          { status: 400 }
        );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}

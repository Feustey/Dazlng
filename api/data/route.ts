import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Données simulées pour le déploiement
const mockData = {
  stats: {
    users_count: 1250,
    nodes_count: 587,
    transactions_count: 45820,
    total_capacity: 324500000, // sats
    avg_node_centrality: 0.42,
    last_updated: new Date().toISOString(),
  },
  nodes: [
    {
      id: "node1",
      name: "ACINQ",
      pubkey:
        "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
      capacity: 34500000,
      channels: 125,
      last_seen: new Date().toISOString(),
    },
    {
      id: "node2",
      name: "Bitfinex",
      pubkey:
        "033d8656219478701227199cbd6f670335c8d408a92ae88b962c49d4dc0e83e025",
      capacity: 28750000,
      channels: 98,
      last_seen: new Date().toISOString(),
    },
    {
      id: "node3",
      name: "River Financial",
      pubkey:
        "03037dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a",
      capacity: 22430000,
      channels: 76,
      last_seen: new Date().toISOString(),
    },
  ],
  profiles: {
    user_id: "mock-user-id",
    username: "johnlnd",
    bio: "Lightning Network enthusiast",
    node_count: 2,
    created_at: "2023-01-15T12:00:00Z",
    user: {
      first_name: "John",
      last_name: "Satoshi",
      email: "john@example.com",
    },
  },
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");

  try {
    let data = {};

    switch (type) {
      case "stats":
        data = { stats: mockData.stats };
        break;

      case "profile":
        const userId = url.searchParams.get("userId");
        if (!userId) {
          return NextResponse.json(
            { error: "ID utilisateur requis" },
            { status: 400 }
          );
        }

        // Retourner des données simulées de profil
        data = {
          profile: {
            ...mockData.profiles,
            user_id: userId, // Utiliser l'ID fourni
          },
        };
        break;

      case "nodes":
        data = { nodes: mockData.nodes };
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

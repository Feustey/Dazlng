import { NextResponse } from "next/server";

// Spécifier que nous utilisons le runtime Node.js et non Edge
export const runtime = "nodejs";

// Forcer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Données de résumé réseau simulées pour le déploiement
const mockNetworkSummary = {
  id: "1",
  nodes_count: 17500,
  channels_count: 93000,
  total_capacity: 5300000000,
  avg_channel_size: 56989,
  avg_channels_per_node: 5.31,
  median_base_fee_msat: 1000,
  median_fee_rate: 500,
  last_updated: new Date().toISOString(),
  created_at: new Date("2023-01-01").toISOString(),
};

export async function GET() {
  try {
    // Pour le déploiement, on retourne toujours les données simulées
    console.log(
      "API network/summary route: utilisation des données simulées pour le déploiement"
    );
    return NextResponse.json(mockNetworkSummary);
  } catch (error) {
    console.error("Erreur lors de la récupération du résumé du réseau:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du résumé du réseau" },
      { status: 500 }
    );
  }
}

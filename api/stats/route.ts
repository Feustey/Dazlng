import { NextResponse } from "next/server";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Données fictives pour les statistiques réseau
const mockNetworkData = {
  current: {
    nodes_count: 12500,
    channels_count: 35800,
    capacity: "1250000000000", // en sats
    avg_channel_size: "3500000", // en sats
    avg_channels_per_node: 5.72,
    top_nodes: [
      {
        alias: "ACINQ",
        pubkey:
          "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
        capacity: "125000000",
        channels: 100,
      },
      {
        alias: "Bitfinex",
        pubkey:
          "033d8656219478701227199cbd6f670335c8d408a92ae88b962c49d4dc0e83e025",
        capacity: "110000000",
        channels: 85,
      },
    ],
  },
  historical: {
    network_growth: {
      timestamps: [
        "2023-10-01",
        "2023-11-01",
        "2023-12-01",
        "2024-01-01",
        "2024-02-01",
        "2024-03-01",
      ],
      nodes_count: [11000, 11800, 12500, 13000, 13500, 14000],
      channels_count: [33000, 34500, 35800, 36500, 37200, 38000],
    },
  },
  last_updated: new Date().toISOString(),
};

export async function GET() {
  try {
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 200));

    return NextResponse.json({
      success: true,
      data: mockNetworkData,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des stats réseau:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur serveur lors de la récupération des statistiques",
      },
      { status: 500 }
    );
  }
}

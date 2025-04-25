import { NextResponse } from "next/server";

// Données fictives pour les statistiques historiques
const mockHistoricalData = {
  network_growth: {
    timestamps: [
      "2023-01-01",
      "2023-02-01",
      "2023-03-01",
      "2023-04-01",
      "2023-05-01",
      "2023-06-01",
      "2023-07-01",
      "2023-08-01",
      "2023-09-01",
      "2023-10-01",
      "2023-11-01",
      "2023-12-01",
    ],
    nodes_count: [
      8000, 8250, 8500, 8700, 9000, 9300, 9600, 10000, 10500, 11000, 11800,
      12500,
    ],
    channels_count: [
      20000, 21000, 22000, 24000, 25500, 27000, 28500, 30000, 31500, 33000,
      34500, 35800,
    ],
    capacity: [
      "800000000000",
      "850000000000",
      "900000000000",
      "950000000000",
      "1000000000000",
      "1050000000000",
      "1100000000000",
      "1150000000000",
      "1180000000000",
      "1200000000000",
      "1230000000000",
      "1250000000000",
    ],
  },
  fee_rates: {
    timestamps: [
      "2023-01-01",
      "2023-03-01",
      "2023-06-01",
      "2023-09-01",
      "2023-12-01",
    ],
    avg_fee_rate: [250, 240, 230, 210, 200],
    avg_base_fee: [1200, 1150, 1100, 1050, 1000],
  },
  updated_at: new Date().toISOString(),
};

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      data: mockHistoricalData,
    });
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des stats historiques:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        error:
          "Erreur serveur lors de la récupération des statistiques historiques",
      },
      { status: 500 }
    );
  }
}

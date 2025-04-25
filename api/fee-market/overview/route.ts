import { NextResponse } from "next/server";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Données fictives pour le marché des frais
const mockFeeMarketOverview = {
  average: {
    base_fee_msat: 1000,
    fee_rate_ppm: 500,
  },
  distribution: {
    ranges: [
      { min: 0, max: 100, count: 5000 },
      { min: 100, max: 300, count: 15000 },
      { min: 300, max: 500, count: 25000 },
      { min: 500, max: 1000, count: 18000 },
      { min: 1000, max: 2000, count: 10000 },
      { min: 2000, max: 5000, count: 5000 },
      { min: 5000, max: Number.MAX_SAFE_INTEGER, count: 2000 },
    ],
    percentiles: {
      p10: 150,
      p25: 250,
      p50: 400,
      p75: 800,
      p90: 1500,
    },
  },
  timestamp: new Date().toISOString(),
};

// Service MCP simulé pour le déploiement
const basicMcpService = {
  testConnection: async () => false,
  getFeeMarketOverview: async () => mockFeeMarketOverview,
};

export async function GET() {
  try {
    // Pour le déploiement, on retourne toujours les données simulées
    console.log(
      "API fee-market/overview route: utilisation des données fictives pour le déploiement"
    );
    return NextResponse.json(mockFeeMarketOverview);
  } catch (error) {
    console.error("Error fetching fee market overview:", error);

    // En cas d'erreur, on retourne quand même les données simulées
    console.log(
      "API fee-market/overview route: utilisation des données fictives suite à une erreur"
    );
    return NextResponse.json(mockFeeMarketOverview);
  }
}

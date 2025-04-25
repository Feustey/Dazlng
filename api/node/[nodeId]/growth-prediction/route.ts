import { NextRequest, NextResponse } from "next/server";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Type pour les prédictions de croissance
interface NodeGrowthPrediction {
  pubkey: string;
  timeframe: "7d" | "30d" | "90d";
  metrics: {
    capacity: number[];
    channels: number[];
    fees: number[];
    dates: string[];
  };
  confidence: number;
  trends: {
    capacityGrowth: number;
    channelGrowth: number;
    feeRevenue: number;
  };
  recommendations: string[];
  timestamp: string;
}

// Données simulées pour les prédictions de croissance
function generateMockGrowthPrediction(
  nodeId: string,
  timeframe: "7d" | "30d" | "90d"
): NodeGrowthPrediction {
  // Générer des dates pour le timeframe
  const dates: string[] = [];
  const now = new Date();
  const numPoints = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90;

  for (let i = 0; i < numPoints; i++) {
    const date = new Date(now);
    date.setDate(now.getDate() + i);
    dates.push(date.toISOString().split("T")[0]);
  }

  // Générer des métriques simulées
  const baseCapacity = 10000000; // 10M sats
  const baseChannels = 25;
  const baseFees = 5000; // 5000 sats

  const capacityGrowth =
    timeframe === "7d" ? 0.05 : timeframe === "30d" ? 0.15 : 0.35;
  const channelGrowth =
    timeframe === "7d" ? 0.03 : timeframe === "30d" ? 0.12 : 0.28;
  const feeGrowth =
    timeframe === "7d" ? 0.08 : timeframe === "30d" ? 0.25 : 0.55;

  return {
    pubkey: nodeId,
    timeframe,
    metrics: {
      capacity: dates.map((_, i) =>
        Math.round(baseCapacity * (1 + (capacityGrowth * i) / numPoints))
      ),
      channels: dates.map((_, i) =>
        Math.round(baseChannels * (1 + (channelGrowth * i) / numPoints))
      ),
      fees: dates.map((_, i) =>
        Math.round(baseFees * (1 + (feeGrowth * i) / numPoints))
      ),
      dates,
    },
    confidence: 0.85,
    trends: {
      capacityGrowth: capacityGrowth * 100,
      channelGrowth: channelGrowth * 100,
      feeRevenue: baseFees * (1 + feeGrowth),
    },
    recommendations: [
      "Ouvrir 3-5 nouveaux canaux avec des nœuds bien connectés",
      "Augmenter légèrement les frais sur les canaux à forte utilisation",
      "Équilibrer la liquidité entre les canaux entrants et sortants",
    ],
    timestamp: new Date().toISOString(),
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) {
  const { nodeId } = params;
  const searchParams = new URL(request.url).searchParams;
  const timeframe =
    (searchParams.get("timeframe") as "7d" | "30d" | "90d") || "30d";

  try {
    // Générer des données simulées
    const growthPrediction = generateMockGrowthPrediction(nodeId, timeframe);
    console.log(
      `Génération de prédictions simulées pour le nœud ${nodeId} avec timeframe ${timeframe}`
    );

    return NextResponse.json(growthPrediction);
  } catch (error) {
    console.error(
      `Erreur lors de la génération des prédictions simulées pour le nœud ${nodeId}:`,
      error
    );

    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des prédictions de croissance",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

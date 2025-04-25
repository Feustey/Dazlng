import { NextRequest, NextResponse } from "next/server";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Type pour les recommandations de frais
interface FeeRecommendation {
  channelId: string;
  peerAlias: string;
  peerPubkey: string;
  currentBaseFeeMsat: number;
  currentFeeRate: number;
  recommendedBaseFeeMsat: number;
  recommendedFeeRate: number;
  expectedRevenue: number;
  impact: "high" | "medium" | "low";
  reasoning: string;
}

// Données simulées pour les recommandations de frais
function generateMockFeeRecommendations(nodeId: string): FeeRecommendation[] {
  // Générer quelques recommandations simulées
  return [
    {
      channelId: `${nodeId.substring(0, 8)}:1`,
      peerAlias: "ACINQ",
      peerPubkey:
        "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
      currentBaseFeeMsat: 1000,
      currentFeeRate: 200,
      recommendedBaseFeeMsat: 1500,
      recommendedFeeRate: 300,
      expectedRevenue: 12500,
      impact: "high",
      reasoning:
        "La demande pour cette route est élevée, augmenter les frais optimiserait votre revenu.",
    },
    {
      channelId: `${nodeId.substring(0, 8)}:2`,
      peerAlias: "Bitfinex",
      peerPubkey:
        "033d8656219478701227199cbd6f670335c8d408a92ae88b962c49d4dc0e83e025",
      currentBaseFeeMsat: 2000,
      currentFeeRate: 500,
      recommendedBaseFeeMsat: 1000,
      recommendedFeeRate: 400,
      expectedRevenue: 9800,
      impact: "medium",
      reasoning:
        "Réduire les frais de base augmenterait le volume de transactions sur ce canal.",
    },
    {
      channelId: `${nodeId.substring(0, 8)}:3`,
      peerAlias: "River Financial",
      peerPubkey:
        "03037dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a",
      currentBaseFeeMsat: 500,
      currentFeeRate: 100,
      recommendedBaseFeeMsat: 800,
      recommendedFeeRate: 150,
      expectedRevenue: 6500,
      impact: "low",
      reasoning:
        "Une légère augmentation des frais optimiserait le rendement sans affecter le volume.",
    },
  ];
}

export async function GET(
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) {
  const { nodeId } = params;

  try {
    // Générer des données simulées
    const feeRecommendations = generateMockFeeRecommendations(nodeId);
    console.log(
      `Génération de recommandations simulées pour le nœud ${nodeId}`
    );

    return NextResponse.json(feeRecommendations);
  } catch (error) {
    console.error(
      `Erreur lors de la génération des recommandations simulées pour le nœud ${nodeId}:`,
      error
    );

    return NextResponse.json(
      {
        error: "Erreur lors de la récupération des recommandations de frais",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Type pour les résultats d'optimisation
interface OptimizationResult {
  suggestedPeers: string[];
  expectedImprovement: number;
  currentScore: number;
  potentialScore: number;
  recommendations: string[];
}

// Générer des données d'optimisation simulées
function generateMockOptimizationResult(nodeId: string): OptimizationResult {
  // Créer des suggestions de pairs basées sur le nodeId
  const peerPrefix = nodeId.substring(0, 4);

  return {
    suggestedPeers: [
      `02${peerPrefix}8743f1c270718be33767eea7b2a05829cb758f65ea3e3e8c29c153d831d9388e2`,
      `03${peerPrefix}6e1f38cbb92abe04f543e99a8aba46c1bbddd94b501a65ad4eea4e2401d4fe57c`,
      `02${peerPrefix}ae7bd22be752dab8f4f5df08f85b5e44f36dc5e4e37d13eec7da33997ddb5c52d`,
    ],
    expectedImprovement: 14.75,
    currentScore: 65.3,
    potentialScore: 80.05,
    recommendations: [
      "Ouvrir des canaux avec des nœuds ayant une meilleure centralité",
      "Équilibrer vos canaux existants pour optimiser le routage",
      "Diversifier la taille de vos canaux pour atteindre différents segments du réseau",
      "Augmenter progressivement vos frais sur les canaux à forte demande",
    ],
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { nodeId: string } }
) {
  const { nodeId } = params;

  try {
    // Générer des données simulées
    const optimizationResult = generateMockOptimizationResult(nodeId);
    console.log(
      `Génération de suggestions d'optimisation simulées pour le nœud ${nodeId}`
    );

    return NextResponse.json(optimizationResult);
  } catch (error) {
    console.error(
      `Erreur lors de la génération des données d'optimisation pour le nœud ${nodeId}:`,
      error
    );

    return NextResponse.json(
      {
        error: "Erreur lors de l'optimisation du nœud",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

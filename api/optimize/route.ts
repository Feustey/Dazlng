import { NextResponse } from "next/server";

// Forcer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Types pour les résultats d'optimisation
interface OptimizationResult {
  suggestedPeers: string[];
  expectedImprovement: number;
  currentScore: number;
  potentialScore: number;
  recommendations: string[];
}

interface NodeInfo {
  alias: string;
  pubkey: string;
  color: string;
  addresses: string[];
  capacity: number;
  channels: number;
  last_update: string;
}

// Données simulées pour l'optimisation
const mockOptimizationResult: OptimizationResult = {
  suggestedPeers: [
    "024655b768ef40951b20053a5c4b951606d4d86085d51238f2c67c7dec29c792ca",
    "03c2abfa93eacec04721c019644584424aab2ba4dff3ac9bdab4e9c97007491dda",
    "022a4bc9dde01a59a16a0251fee79a92131933aba0323959203c5f0fc6290f9d2c",
  ],
  expectedImprovement: 17.5,
  currentScore: 62.8,
  potentialScore: 80.3,
  recommendations: [
    "Ouvrir des canaux avec des nœuds plus centraux du réseau",
    "Équilibrer vos canaux existants pour optimiser le routage",
    "Ajuster vos frais pour être plus compétitif sur certaines routes",
    "Considérer la fermeture des canaux inactifs depuis plus de 60 jours",
  ],
};

// Données simulées pour les informations du nœud
const mockNodeInfo: NodeInfo = {
  alias: "Daznode",
  pubkey: "02a7e400bcea20c5c3ede184c26ae0db6fc1a71f8f3c0eca6ec261b9966e7fc9ef",
  color: "#3399ff",
  addresses: ["127.0.0.1:9735", "k4jfn5scqkx6kn6m.onion:9735"],
  capacity: 12500000,
  channels: 25,
  last_update: new Date().toISOString(),
};

export async function GET() {
  try {
    return NextResponse.json({
      ...mockOptimizationResult,
      nodeInfo: mockNodeInfo,
    });
  } catch (error) {
    console.error("Erreur lors de la génération des données simulées:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // On ignore les données de la requête et on retourne toujours les mêmes données simulées
    console.log(
      "Génération de données d'optimisation simulées pour une requête POST"
    );

    return NextResponse.json({
      ...mockOptimizationResult,
      nodeInfo: mockNodeInfo,
    });
  } catch (error) {
    console.error("Erreur lors de la génération des données simulées:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'optimisation du nœud" },
      { status: 500 }
    );
  }
}

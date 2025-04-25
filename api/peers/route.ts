import {
  successResponse,
  errorResponse,
  HttpStatus,
} from "../../api/responses";

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

// Configuration de la revalidation
export const revalidate = 300; // Revalider toutes les 5 minutes

// Types pour les pairs
interface PeerNode {
  pubkey: string;
  alias: string;
  capacity: number;
  num_channels: number;
  last_update: string;
}

// Fonction pour générer des données de pairs simulées
function generateMockPeers(nodePubkey: string): PeerNode[] {
  // Utiliser le prefixe du pubkey pour générer des données déterministes
  const prefix = nodePubkey.substring(0, 6);

  // Créer une liste de pairs simulés
  return [
    {
      pubkey: `02${prefix}1c270718be33767eea7b2a05829cb758f65ea3e3e8c29c153d831d9388e2`,
      alias: "ACINQ",
      capacity: 15000000,
      num_channels: 25,
      last_update: new Date().toISOString(),
    },
    {
      pubkey: `03${prefix}f38cbb92abe04f543e99a8aba46c1bbddd94b501a65ad4eea4e2401d4fe57c`,
      alias: "Bitfinex",
      capacity: 12000000,
      num_channels: 18,
      last_update: new Date().toISOString(),
    },
    {
      pubkey: `02${prefix}bd22be752dab8f4f5df08f85b5e44f36dc5e4e37d13eec7da33997ddb5c52d`,
      alias: "Kraken",
      capacity: 9000000,
      num_channels: 12,
      last_update: new Date().toISOString(),
    },
    {
      pubkey: `03${prefix}dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a`,
      alias: "River Financial",
      capacity: 7500000,
      num_channels: 10,
      last_update: new Date().toISOString(),
    },
    {
      pubkey: `02${prefix}e400bcea20c5c3ede184c26ae0db6fc1a71f8f3c0eca6ec261b9966e7fc9ef`,
      alias: "LN+",
      capacity: 6000000,
      num_channels: 8,
      last_update: new Date().toISOString(),
    },
  ];
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const nodePubkey = url.searchParams.get("nodePubkey");

    if (!nodePubkey) {
      return errorResponse("Le paramètre nodePubkey est requis", {
        status: HttpStatus.BAD_REQUEST,
      });
    }

    // Simuler un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Générer des données simulées
    const peersData = generateMockPeers(nodePubkey);
    console.log(`Pairs simulés générés pour le nœud: ${nodePubkey}`);

    return successResponse(peersData, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    console.error("Error fetching peers:", error);
    return errorResponse("Erreur lors de la récupération des pairs", {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

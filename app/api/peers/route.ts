import { getPeersOfPeers } from "../../services/network.service";
import {
  successResponse,
  errorResponse,
  HttpStatus,
} from "../../lib/api/responses";

// Utiliser une stratégie de mise en cache au lieu de force-dynamic
export const revalidate = 3600; // Revalider toutes les heures

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const nodePubkey = url.searchParams.get("nodePubkey");

    if (!nodePubkey) {
      return errorResponse("Le paramètre nodePubkey est requis", {
        status: HttpStatus.BAD_REQUEST,
      });
    }

    const peersData = await getPeersOfPeers(nodePubkey);
    return successResponse(peersData);
  } catch (error) {
    console.error("Error fetching peers:", error);
    return errorResponse("Erreur lors de la récupération des pairs", {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}

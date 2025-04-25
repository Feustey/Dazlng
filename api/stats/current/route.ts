import { NextResponse } from "next/server";

// Types pour les réponses API
type ApiResponseOptions = {
  status?: number;
  headers?: Record<string, string>;
};

// Codes de statut HTTP
const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// Fonctions helper pour les réponses API
function successResponse<T>(data: T, options: ApiResponseOptions = {}) {
  const { status = 200, headers = {} } = options;
  return NextResponse.json({ success: true, data }, { status, headers });
}

function errorResponse(
  error: string | Error,
  options: ApiResponseOptions = {}
) {
  const { status = 500, headers = {} } = options;
  const errorMessage = error instanceof Error ? error.message : error;
  return NextResponse.json(
    { success: false, error: errorMessage },
    { status, headers }
  );
}

// Données fictives pour les statistiques réseau
const mockNetworkStats = {
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
    {
      alias: "River Financial",
      pubkey:
        "03037dc08e9ac63b82581f79b662a4d0ceca8a8ca162b1af3551595b8f2d97b70a",
      capacity: "95000000",
      channels: 78,
    },
  ],
  timestamp: new Date().toISOString(),
};

// Activer le mode dynamique pour éviter le cache
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    // Simuler un délai de réseau
    await new Promise((resolve) => setTimeout(resolve, 200));

    return successResponse(mockNetworkStats);
  } catch (error) {
    console.error("Erreur lors de la récupération des stats réseau:", error);
    return errorResponse(
      "Erreur serveur lors de la récupération des statistiques réseau",
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      }
    );
  }
}

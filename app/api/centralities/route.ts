import { NextResponse } from "next/server";
import mcpService from "@/app/lib/mcpService";
import {
  dynamic,
  runtime,
  errorResponse,
  successResponse,
} from "@/app/api/config";

export { dynamic, runtime };

// Données fictives pour le développement
const mockCentralities = {
  betweenness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `02${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  eigenvector: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  closeness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  weighted_betweenness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `02${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  weighted_eigenvector: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  weighted_closeness: Array.from({ length: 20 }, (_, i) => ({
    pubkey: `03${Math.random().toString(16).substring(2, 30)}`,
    value: Math.random() * 0.1,
    rank: i + 1,
  })),
  last_update: new Date().toISOString(),
};

// Activer le mode développement pour utiliser les données fictives
const USE_MOCK_DATA = process.env.NODE_ENV === "development";

export async function GET() {
  try {
    const centralities = await mcpService.getCentralities();
    return successResponse(centralities);
  } catch (error) {
    console.error("Error fetching centralities:", error);
    return errorResponse("Failed to fetch centralities");
  }
}

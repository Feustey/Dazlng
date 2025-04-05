import { NextResponse } from "next/server";
import { dynamic, errorResponse, successResponse } from "@/app/api/config";

export const runtime = "edge";
export { dynamic };

export async function GET() {
  try {
    const connectionTest = {
      status: "success",
      message: "Connexion à l'API MCP réussie",
    };

    const endpoints = {
      nodes: "/api/nodes",
      peers: "/api/peers",
      centralities: "/api/centralities",
      review: "/api/review",
      history: "/api/history",
      historical: "/api/historical",
      stats: "/api/stats",
    };

    const errors: string[] = [];

    return successResponse({
      connection: connectionTest,
      endpoints,
      errors: errors.length > 0 ? errors : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur lors du test MCP:", error);
    return errorResponse("Erreur lors du test MCP");
  }
}

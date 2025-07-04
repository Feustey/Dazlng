import { NextRequest, NextResponse } from "next/server"
import { ApiResponse } from "@/types/database"
import { logger } from "@/lib/logger"
import { mcpLightAPI } from "@/lib/services/mcp-light-api"

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Récupérer le body de la requête
    const body = await req.json()
    
    // Récupérer les headers d'autorisation
    const authorization = req.headers.get("authorization")
    if (authorization) {
      const apiKey = authorization.replace("Bearer ", "")
      // Configurer l'API key si nécessaire
      // Note: à implémenter dans MCPLightAPI si besoin
    }

    // Initialiser l'API
    await mcpLightAPI.initialize()

    // Récupérer les recommandations
    const data = await mcpLightAPI.getRecommendations(body.pubkey)

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    })

  } catch (error) {
    logger.error("Erreur proxy unified recommendations:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "PROXY_ERROR",
        message: error instanceof Error ? error.message : "Erreur lors de la récupération des recommandations unifiées",
        details: error instanceof Error ? error.stack : undefined
      }
    }, { status: 502 })
  }
}
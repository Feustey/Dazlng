import { NextRequest, NextResponse } from "next/server"
import { mcpLightAPI } from "@/lib/services/mcp-light-api"
import { ApiResponse } from "@/types/database"
import { DaznoRecommendationsResponse, DaznoSparkSeerRecommendation } from "@/types/dazno-api"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params
    const pubkey = resolvedParams.pubkey

    await mcpLightAPI.initialize()
    const mcpResponse = await mcpLightAPI.getRecommendations(pubkey)

    // Conversion du format MCP vers le format Dazno
    const daznoRecommendations: DaznoSparkSeerRecommendation[] = mcpResponse.recommendations.map((rec: any) => ({
      type: rec.action_type === "channel_open" ? "channel" : 
            rec.action_type === "fee_update" ? "fee" : "close",
      action: rec.type,
      reason: rec.reasoning || "",
      target_pubkey: rec.target_pubkey,
      ideal_capacity: rec.suggested_amount,
      current_fee: undefined,
      recommended_fee: undefined
    }))

    const response: DaznoRecommendationsResponse = {
      pubkey: mcpResponse.pubkey,
      recommendations: daznoRecommendations,
      generated_at: mcpResponse.timestamp
    }

    return NextResponse.json<ApiResponse<DaznoRecommendationsResponse>>({
      success: true,
      data: response,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    })

  } catch (error) {
    console.error("Erreur recommandations:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "EXTERNAL_API_ERROR",
        message: error instanceof Error ? error.message : "Erreur lors de la récupération des recommandations"
      }
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
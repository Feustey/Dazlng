import { NextRequest, NextResponse } from "next/server";
import { mcpLightAPI } from "@/lib/services/mcp-light-api";

export async function GET(
  request: NextRequest,
  { params }: { params: { pubkey: string } }
) {
  try {
    const { pubkey } = params;
    
    if (!pubkey) {
      return NextResponse.json({
        success: false,
        error: {
          code: "MISSING_PUBKEY",
          message: "Pubkey manquante"
        }
      }, { status: 400 });
    }

    await mcpLightAPI.initialize();

    // Récupérer la courbe de fiabilité
    const reliabilityCurve = await mcpLightAPI.getReliabilityCurve(pubkey);

    return NextResponse.json({
      success: true,
      data: reliabilityCurve,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      }
    });

  } catch (error) {
    console.error("❌ Erreur courbe de fiabilité:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "RELIABILITY_CURVE_ERROR",
        message: error instanceof Error ? error.message : "Erreur lors de la récupération de la courbe de fiabilité",
        details: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

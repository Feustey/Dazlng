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

    // Identifier les goulots d'étranglement
    const bottlenecks = await mcpLightAPI.getBottlenecks(pubkey);

    return NextResponse.json({
      success: true,
      data: bottlenecks,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0.0"
      }
    });

  } catch (error) {
    console.error("❌ Erreur identification goulots:", error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: "BOTTLENECKS_ERROR",
        message: error instanceof Error ? error.message : "Erreur lors de l'identification des goulots d'étranglement",
        details: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

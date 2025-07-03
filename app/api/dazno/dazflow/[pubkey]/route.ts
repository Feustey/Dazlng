import { NextRequest, NextResponse } from 'next/server';
import { mcpLightAPI } from '@/lib/services/mcp-light-api';

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
          code: 'MISSING_PUBKEY',
          message: 'Pubkey manquante'
        }
      }, { status: 400 });
    }

    await mcpLightAPI.initialize();

    // Utiliser l'analyse DazFlow Index
    const dazFlowAnalysis = await mcpLightAPI.getDazFlowAnalysis(pubkey);

    return NextResponse.json({
      success: true,
      data: dazFlowAnalysis,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Erreur analyse DazFlow:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'DAZFLOW_ANALYSIS_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de l\'analyse DazFlow',
        details: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
} 
export const dynamic = "force-dynamic";

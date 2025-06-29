import { NextRequest, NextResponse } from 'next/server';
import { mcpLightAPI } from '@/lib/services/mcp-light-api';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await mcpLightAPI.initialize();

    // Évaluer la santé du réseau
    const networkHealth = await mcpLightAPI.getNetworkHealth();

    return NextResponse.json({
      success: true,
      data: networkHealth,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Erreur santé réseau:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'NETWORK_HEALTH_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de l\'évaluation de la santé du réseau',
        details: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
} 
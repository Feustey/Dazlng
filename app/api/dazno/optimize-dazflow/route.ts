import { NextRequest, NextResponse } from 'next/server';
import { mcpLightAPI } from '@/lib/services/mcp-light-api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { node_id, optimization_target, constraints } = body;

    if (!node_id) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_NODE_ID',
          message: 'Node ID manquant'
        }
      }, { status: 400 });
    }

    await mcpLightAPI.initialize();

    // Optimiser DazFlow Index
    const optimizationResult = await mcpLightAPI.optimizeDazFlow({
      node_id,
      optimization_target: optimization_target || 'balanced',
      constraints
    });

    return NextResponse.json({
      success: true,
      data: optimizationResult,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });

  } catch (error) {
    console.error('❌ Erreur optimisation DazFlow:', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'DAZFLOW_OPTIMIZATION_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de l\'optimisation DazFlow',
        details: error instanceof Error ? error.stack : undefined
      }
    }, { status: 500 });
  }
} 
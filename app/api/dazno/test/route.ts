import { NextRequest, NextResponse } from 'next/server';
import { daznoApi } from '@/lib/dazno-api';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Tester la santé de l'API
    const health = await daznoApi.checkHealth();
    
    const searchParams = request.nextUrl.searchParams;
    const testPubkey = searchParams.get('pubkey');
    
    if (testPubkey) {
      // Test avec une pubkey spécifique
      const [nodeInfo, recommendations, priorities] = await Promise.allSettled([
        daznoApi.getNodeInfo(testPubkey),
        daznoApi.getRecommendations(testPubkey),
        daznoApi.getPriorityActions(testPubkey)
      ]);

      return NextResponse.json({
        success: true,
        health,
        test_pubkey: testPubkey,
        results: {
          node_info: nodeInfo.status === 'fulfilled' ? nodeInfo.value : { error: nodeInfo.reason },
          recommendations: recommendations.status === 'fulfilled' ? recommendations.value : { error: recommendations.reason },
          priorities: priorities.status === 'fulfilled' ? priorities.value : { error: priorities.reason }
        }
      });
    }

    return NextResponse.json({
      success: true,
      health,
      message: 'API Dazno test endpoint - add ?pubkey=<your_pubkey> to test with a specific node'
    });

  } catch (error) {
    console.error('[API] Dazno test error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Dazno API test failed'
    }, { status: 500 });
  }
} 
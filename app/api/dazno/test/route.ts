import { NextResponse } from 'next/server';
import { daznoApi, checkApiHealth } from '@/lib/dazno-api';

export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  try {
    // Test de santé de l'API DazNo
    const isHealthy = await checkApiHealth();
    
    let apiStatus = 'down';
    let healthData = null;
    
    if (isHealthy) {
      try {
        healthData = await daznoApi.checkHealth();
        apiStatus = 'up';
      } catch (error) {
        console.error('[DazNo API Test] Health check failed:', error);
      }
    }

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      dazno_api: {
        status: apiStatus,
        health_data: healthData,
        endpoints: {
          health: 'GET /health',
          node_info: 'GET /api/v1/node/{pubkey}/info',
          recommendations: 'GET /api/v1/node/{pubkey}/recommendations',
          priorities: 'POST /api/v1/node/{pubkey}/priorities'
        }
      },
      integration: {
        client_created: true,
        functions_available: [
          'checkApiHealth',
          'getNodeInfo',
          'getRecommendations', 
          'getPriorityActions'
        ]
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 
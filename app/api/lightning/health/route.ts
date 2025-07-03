import { NextRequest, NextResponse } from 'next/server';
import { createDaznoApiOnlyService } from '@/lib/services/dazno-api-only';

export const dynamic = "force-dynamic";

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  service: {
    name: string;
    status: 'online' | 'offline';
    provider: string;
    lastCheck: string;
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  try {
    console.log('🏥 Health check - Vérification api.dazno.de');
    
    const lightningService = createDaznoApiOnlyService();
    const health = await lightningService.healthCheck();
    
    const healthResponse: HealthResponse = {
      status: health.isOnline ? 'healthy' : 'down',
      timestamp: new Date().toISOString(),
      service: {
        name: 'api.dazno.de',
        status: health.isOnline ? 'online' : 'offline',
        provider: health.provider,
        lastCheck: new Date().toISOString()
      }
    };

    console.log(`✅ Health check terminé - Statut: ${healthResponse.status}`);

    return NextResponse.json(healthResponse, { 
      status: health.isOnline ? 200 : 503 
    });

  } catch (error) {
    console.error('❌ Health check - Erreur:', error);
    
    const errorResponse: HealthResponse = {
      status: 'down',
      timestamp: new Date().toISOString(),
      service: {
        name: 'api.dazno.de',
        status: 'offline',
        provider: 'api.dazno.de',
        lastCheck: new Date().toISOString()
      }
    };

    return NextResponse.json(errorResponse, { status: 503 });
  }
}

// Endpoint pour health check simple (pour load balancers)
export async function HEAD(req: NextRequest): Promise<Response> {
  try {
    const lightningService = createDaznoApiOnlyService();
    const health = await lightningService.healthCheck();
    
    return new NextResponse(null, {
      status: health.isOnline ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  }
}
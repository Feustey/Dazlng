import { NextRequest, NextResponse } from 'next/server';
import { createInvoiceFallbackService } from '@/lib/services/invoice-fallback-service';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

interface HealthResponse {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  services: Array<{
    name: string;
    status: 'online' | 'offline';
    provider: string;
    lastCheck: string;
    latency?: number;
  }>;
  fallback: {
    isOnline: boolean;
    activeProvider: string;
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  let fallbackService: any = null;
  
  try {
    console.log('🏥 Health check - Vérification de tous les services Lightning');
    
    // Création du service de fallback pour le health check
    fallbackService = createInvoiceFallbackService({
      maxRetries: 1,
      retryDelay: 500,
      enableLocalLnd: true,
      enableMockService: process.env.NODE_ENV === 'development'
    });

    // Forcer une vérification de la santé de tous les services
    await fallbackService.forceHealthCheck();
    
    // Récupérer le statut de tous les services
    const servicesStatus = fallbackService.getServicesStatus();
    const fallbackHealth = await fallbackService.healthCheck();
    
    // Mapper les services pour la réponse
    const services = Object.entries(servicesStatus).map(([name, health]: [string, any]) => ({
      name,
      status: health.isOnline ? 'online' as const : 'offline' as const,
      provider: health.provider,
      lastCheck: health.lastCheck?.toISOString() || new Date().toISOString(),
      latency: health.latency
    }));

    // Déterminer le statut global
    const onlineServices = services.filter(s => s.status === 'online').length;
    const totalServices = services.length;
    
    let globalStatus: 'healthy' | 'degraded' | 'down';
    if (onlineServices === 0) {
      globalStatus = 'down';
    } else if (onlineServices === totalServices) {
      globalStatus = 'healthy';
    } else {
      globalStatus = 'degraded';
    }

    const healthResponse: HealthResponse = {
      status: globalStatus,
      timestamp: new Date().toISOString(),
      services,
      fallback: {
        isOnline: fallbackHealth.isOnline,
        activeProvider: fallbackHealth.provider
      }
    };

    console.log(`✅ Health check terminé - Statut: ${globalStatus} - Provider actif: ${fallbackHealth.provider}`);

    return NextResponse.json(healthResponse, {
      status: globalStatus === 'down' ? 503 : 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('❌ Health check - Erreur:', error);
    
    const errorResponse: HealthResponse = {
      status: 'down',
      timestamp: new Date().toISOString(),
      services: [],
      fallback: {
        isOnline: false,
        activeProvider: 'none'
      }
    };

    return NextResponse.json(errorResponse, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } finally {
    // Nettoyage
    if (fallbackService) {
      fallbackService.destroy();
    }
  }
}

// Endpoint pour health check simple (pour load balancers)
export async function HEAD(req: NextRequest): Promise<Response> {
  let fallbackService: any = null;
  
  try {
    fallbackService = createInvoiceFallbackService({
      maxRetries: 1,
      retryDelay: 200,
      enableLocalLnd: true,
      enableMockService: false
    });

    const health = await fallbackService.healthCheck();
    
    return new NextResponse(null, {
      status: health.isOnline ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache'
      }
    });
  } catch (error) {
    return new NextResponse(null, { status: 503 });
  } finally {
    if (fallbackService) {
      fallbackService.destroy();
    }
  }
}
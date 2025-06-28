import { NextResponse } from 'next/server';
import { createDazNodeLightningService } from '@/lib/services/daznode-lightning-service';
import { createInvoiceFallbackService } from '@/lib/services/invoice-fallback-service';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

// Constantes
const PROVIDER = 'daznode@getalby.com';
const CORS_ORIGINS = ['https://daznode.com', 'https://app.daznode.com', 'http://localhost:3001'];

// Configuration CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': CORS_ORIGINS.join(', '),
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 heures
};

// Types de réponse API
interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta: {
    timestamp: string;
    provider: string;
  };
}

// Codes d'erreur
const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  LIGHTNING_ERROR: 'LIGHTNING_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

// Handlers
export async function OPTIONS(): Promise<Response> {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(): Promise<Response> {
  return NextResponse.json({
    success: true,
    message: `create-invoice endpoint - ${PROVIDER}`,
    provider: `lightning + ${PROVIDER}`,
    methods: ['POST'],
    timestamp: new Date().toISOString()
  }, { 
    status: 200,
    headers: corsHeaders 
  });
}

export async function POST(request: Request): Promise<Response> {
  let fallbackService: any = null;
  
  try {
    const data = await request.json();
    
    // Utilisation du service de fallback
    fallbackService = createInvoiceFallbackService({
      maxRetries: 3,
      retryDelay: 1000,
      enableLocalLnd: true,
      enableMockService: process.env.NODE_ENV === 'development'
    });

    await fallbackService.forceHealthCheck();
    const invoice = await fallbackService.generateInvoice(data);
    
    return NextResponse.json({
      success: true,
      data: invoice,
      meta: {
        timestamp: new Date().toISOString(),
        provider: (await fallbackService.healthCheck()).provider
      }
    });
  } catch (error) {
    console.error('❌ Erreur création facture (fallback échoué):', error);
    
    return NextResponse.json({
      success: false,
      error: {
        code: 'INVOICE_CREATION_ERROR',
        message: error instanceof Error ? error.message : 'Erreur inconnue - tous services indisponibles'
      }
    }, { status: 503 });
  } finally {
    if (fallbackService) {
      fallbackService.destroy();
    }
  }
}

function _createErrorResponse(code: keyof typeof ErrorCodes, message: string, details?: unknown, status = 400): Response {
  return NextResponse.json<ApiResponse<null>>({
    success: false,
    error: {
      code: ErrorCodes[code],
      message,
      details
    },
    meta: {
      timestamp: new Date().toISOString(),
      provider: PROVIDER
    }
  }, { 
    status,
    headers: corsHeaders
  });
}

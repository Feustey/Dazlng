import { NextResponse, NextRequest } from 'next/server';
import { createDazNodeLightningService } from '@/lib/services/daznode-lightning-service';
import { createInvoiceFallbackService } from '@/lib/services/invoice-fallback-service';
import { LightningServiceImpl } from '@/lib/services/lightning-service';
import { validateData, createInvoiceSchema } from '@/lib/validations/lightning';
import { handleApiError } from '@/lib/api-response';

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

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Extraction du token JWT depuis les headers
    const authHeader = req.headers.get('authorization');
    const jwtToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    // Validation des données de la requête
    const body = await req.json();
    const validation = validateData(createInvoiceSchema, body);
    
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Données de requête invalides',
          details: validation.error.format()
        }
      }, { status: 400 });
    }

    const { amount, description, metadata } = validation.data;

    // Création du service Lightning avec JWT
    const lightningService = new LightningServiceImpl();
    
    // Vérification si JWT est requis
    if (lightningService.isJWTEnabled() && !jwtToken) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'JWT_REQUIRED',
          message: 'Token JWT requis pour les opérations Lightning',
          details: {
            jwt_enabled: true,
            tenant: lightningService.getJWTTenant()
          }
        }
      }, { status: 401 });
    }

    // Génération de la facture avec JWT
    const result = await lightningService.generateInvoice({
      amount,
      description,
      metadata
    });

    return NextResponse.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        jwt_authenticated: lightningService.isJWTEnabled(),
        tenant: lightningService.getJWTTenant()
      }
    });

  } catch (error) {
    return handleApiError(error);
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

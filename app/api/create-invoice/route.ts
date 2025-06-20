import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { daznoAPI } from '@/lib/services/dazno-api';
import { OrderService } from '@/lib/services/order-service';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

// Constantes
const PROVIDER = 'daznode@getalby.com';
const CORS_ORIGINS = ['https://daznode.com', 'https://app.daznode.com'];

// Schéma de validation Zod
const CreateInvoiceSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  metadata: z.record(z.unknown()).optional()
});

// Types
interface ApiResponse<T> {
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

// Configuration CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': CORS_ORIGINS.join(', '),
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 heures
};

// Codes d'erreur
const ErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  LIGHTNING_ERROR: 'LIGHTNING_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;

// Middleware d'authentification
async function authenticateRequest(): Promise<boolean> {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      console.error('❌ Erreur d\'authentification:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'authentification:', error);
    return false;
  }
}

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
  }, { headers: corsHeaders });
}

export async function POST(req: NextRequest): Promise<Response> {
  console.log(`🚀 create-invoice - Nouvelle requête via DaznoAPI`);
  try {
    // Vérification de l'authentification
    const isAuthenticated = await authenticateRequest();
    if (!isAuthenticated) {
      return createErrorResponse('UNAUTHORIZED', 'Authentification requise', null, 401);
    }

    // Validation des données d'entrée avec Zod
    const body = await req.json();
    const validationResult = CreateInvoiceSchema.safeParse(body);
    if (!validationResult.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Données invalides', validationResult.error.format());
    }
    const { amount, description, metadata } = validationResult.data;
    console.log('✅ create-invoice - Paramètres validés:', { amount, description });

    // Création de la facture via l'API Dazno
    const invoice = await daznoAPI.createInvoice({
      amount,
      description,
      metadata,
    });

    // Persistance de la commande dans la base de données
    const orderService = new OrderService();
    const order = await orderService.createOrder({
      product_type: (metadata?.product_type as 'daznode' | 'dazbox' | 'dazpay') || 'daznode',
      amount,
      customer: (metadata?.customer as { name: string; email: string; address?: string; plan?: 'basic' | 'premium' | 'enterprise' }) || { name: '', email: '' },
      plan: (metadata?.plan as 'basic' | 'premium' | 'enterprise') || undefined,
      billing_cycle: (metadata?.billing_cycle as 'monthly' | 'yearly') || undefined,
      metadata: {
        ...metadata,
        payment_hash: invoice.paymentHash,
        payment_request: invoice.paymentRequest,
      },
    });

    return NextResponse.json<ApiResponse<{ invoice: any; order: any; provider: string }>>({
      success: true,
      data: {
        invoice,
        order,
        provider: PROVIDER
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: PROVIDER
      }
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('❌ create-invoice - Erreur:', error);
    return createErrorResponse(
      'LIGHTNING_ERROR',
      'Erreur lors de la génération de la facture',
      error instanceof Error ? error.message : 'Erreur inconnue',
      500
    );
  }
}

function createErrorResponse(code: keyof typeof ErrorCodes, message: string, details?: unknown, status = 400): Response {
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
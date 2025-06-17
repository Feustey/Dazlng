import { NextRequest, NextResponse } from 'next/server';
import { createDazNodeLightningService } from '@/lib/services/daznode-lightning-service';
import { randomUUID } from 'crypto';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

// Schéma de validation Zod
const CreateInvoiceSchema = z.object({
  amount: z.number().positive(),
  description: z.string().min(1),
  metadata: z.record(z.unknown()).optional()
});

interface InvoiceResponse {
  id: string;
  paymentRequest: string;
  paymentHash: string;
  amount: number;
  description: string;
  expiresAt: string;
  createdAt: string;
}

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
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

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

// Mode simulation pour tests
const SIMULATION_MODE = process.env.NODE_ENV === 'development' && !process.env.FORCE_LIGHTNING_CONNECTION;

function generateSimulatedInvoice(amount: number, description: string): InvoiceResponse {
  const paymentHash = randomUUID().replace(/-/g, '');
  const paymentRequest = `lnbc${Math.floor(amount/1000)}m1p${paymentHash}pp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdq5xysxxatsyp3k7enxv4jsxqzpuaztrnwngzn3kdzw5hydlzf03qdgm2hdq27cqv3agm2awhz5se903vruatfhq77w3ls4evs3ch9zw97j25emudupq63nyw24cg27h2rspfj9srp`;
  
  return {
    id: paymentHash,
    paymentRequest,
    paymentHash,
    amount,
    description,
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    createdAt: new Date().toISOString()
  };
}

export async function GET(): Promise<Response> {
  return NextResponse.json({
    success: true,
    message: 'create-invoice endpoint - daznode@getalby.com',
    provider: 'lightning + daznode@getalby.com',
    methods: ['POST'],
    timestamp: new Date().toISOString()
  }, { headers: corsHeaders });
}

export async function POST(req: NextRequest): Promise<Response> {
  console.log('🚀 create-invoice - Nouvelle requête via daznode@getalby.com');
  
  try {
    // Vérification de l'authentification
    const isAuthenticated = await authenticateRequest();
    if (!isAuthenticated) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentification requise'
        },
        meta: {
          timestamp: new Date().toISOString(),
          provider: 'daznode@getalby.com'
        }
      }, { 
        status: 401,
        headers: corsHeaders
      });
    }

    // Validation des données d'entrée avec Zod
    const body = await req.json();
    const validationResult = CreateInvoiceSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Données invalides',
          details: validationResult.error.format()
        },
        meta: {
          timestamp: new Date().toISOString(),
          provider: 'daznode@getalby.com'
        }
      }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    const { amount, description } = validationResult.data;
    console.log('✅ create-invoice - Paramètres validés:', { amount, description });

    let invoice: InvoiceResponse;

    if (SIMULATION_MODE) {
      console.log('🔄 create-invoice - Mode simulation activé');
      invoice = generateSimulatedInvoice(amount, description);
    } else {
      const lightningService = createDazNodeLightningService();
      const result = await lightningService.generateInvoice({
        amount,
        description,
        expiry: 3600
      });
      
      invoice = {
        id: result.id,
        paymentRequest: result.paymentRequest,
        paymentHash: result.paymentHash,
        amount,
        description,
        expiresAt: result.expiresAt,
        createdAt: new Date().toISOString()
      };
    }
    
    console.log('✅ create-invoice - Facture créée:', {
      id: invoice.id.substring(0, 20) + '...',
      amount: invoice.amount,
      simulation: SIMULATION_MODE
    });

    return NextResponse.json<ApiResponse<{ invoice: InvoiceResponse; provider: string }>>({
      success: true,
      data: {
        invoice,
        provider: SIMULATION_MODE ? 'daznode@getalby.com (simulation)' : 'daznode@getalby.com'
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: 'daznode@getalby.com'
      }
    }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('❌ create-invoice - Erreur:', error);
    
    // Fallback en mode simulation si nécessaire
    if (!SIMULATION_MODE) {
      try {
        const body = await req.json();
        const validationResult = CreateInvoiceSchema.safeParse(body);
        
        if (validationResult.success) {
          const { amount, description } = validationResult.data;
          const invoice = generateSimulatedInvoice(amount, description);
          
          return NextResponse.json<ApiResponse<{ invoice: InvoiceResponse; provider: string }>>({
            success: true,
            data: {
              invoice,
              provider: 'daznode@getalby.com (fallback simulation)'
            },
            meta: {
              timestamp: new Date().toISOString(),
              provider: 'daznode@getalby.com'
            }
          }, { headers: corsHeaders });
        }
      } catch (fallbackError) {
        console.error('❌ create-invoice - Erreur fallback:', fallbackError);
      }
    }
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'LIGHTNING_ERROR',
        message: 'Erreur lors de la génération de la facture',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: 'daznode@getalby.com'
      }
    }, { 
      status: 500,
      headers: corsHeaders
    });
  }
} 
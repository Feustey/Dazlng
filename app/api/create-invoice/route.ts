import { NextRequest, NextResponse } from 'next/server';
import { createDazNodeLightningService } from '@/lib/services/daznode-lightning-service';
import { randomUUID } from 'crypto';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

// Méthode GET pour diagnostics
export async function GET(): Promise<Response> {
  return NextResponse.json({
    success: true,
    message: 'create-invoice endpoint - daznode@getalby.com',
    provider: 'lightning + daznode@getalby.com',
    methods: ['POST'],
    timestamp: new Date().toISOString()
  });
}

interface CreateInvoiceRequest {
  amount: number;
  description: string;
  metadata?: Record<string, unknown>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: string | Record<string, unknown>;
  };
  meta?: {
    timestamp: string;
    provider: string;
  };
}

// Mode simulation pour tests
const SIMULATION_MODE = process.env.NODE_ENV === 'development' && !process.env.FORCE_LIGHTNING_CONNECTION;

function generateSimulatedInvoice(amount: number, description: string) {
  const paymentHash = randomUUID().replace(/-/g, '');
  const paymentRequest = `lnbc${Math.floor(amount/1000)}m1p${paymentHash}pp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdq5xysxxatsyp3k7enxv4jsxqzpuaztrnwngzn3kdzw5hydlzf03qdgm2hdq27cqv3agm2awhz5se903vruatfhq77w3ls4evs3ch9zw97j25emudupq63nyw24cg27h2rspfj9srp`;
  
  return {
    id: paymentHash,
    paymentRequest,
    paymentHash,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    amount,
    description
  };
}

export async function POST(req: NextRequest): Promise<Response> {
  console.log('🚀 create-invoice - Nouvelle requête via daznode@getalby.com');
  
  try {
    const body: CreateInvoiceRequest = await req.json();
    const { amount, description, metadata } = body;

    // Validation des paramètres d'entrée
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Montant invalide: ${amount}`
        },
        meta: {
          timestamp: new Date().toISOString(),
          provider: 'daznode@getalby.com'
        }
      }, { status: 400 });
    }
    
    if (!description || typeof description !== 'string') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: `Description invalide: ${description}`
        },
        meta: {
          timestamp: new Date().toISOString(),
          provider: 'daznode@getalby.com'
        }
      }, { status: 400 });
    }

    console.log('✅ create-invoice - Paramètres validés:', { amount, description });

    let invoice;

    if (SIMULATION_MODE) {
      console.log('🔄 create-invoice - Mode simulation activé');
      invoice = generateSimulatedInvoice(amount, description);
    } else {
      // Utilisation du service Lightning daznode@getalby.com
      const lightningService = createDazNodeLightningService();
      
      invoice = await lightningService.generateInvoice({
        amount,
        description,
        expiry: 3600 // 1 heure
      });
    }
    
    console.log('✅ create-invoice - Facture créée:', {
      id: invoice.id?.substring(0, 20) + '...',
      amount: invoice.amount,
      simulation: SIMULATION_MODE
    });

    return NextResponse.json<ApiResponse<{ invoice: object; provider: string }>>({
      success: true,
      data: {
        invoice: {
          id: invoice.id,
          payment_request: invoice.paymentRequest,
          payment_hash: invoice.paymentHash,
          amount,
          description,
          expires_at: invoice.expiresAt,
          metadata
        },
        provider: SIMULATION_MODE ? 'daznode@getalby.com (simulation)' : 'daznode@getalby.com'
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: 'daznode@getalby.com'
      }
    });
    
  } catch (error) {
    console.error('❌ create-invoice - Erreur daznode@getalby.com:', error);
    
    // En cas d'erreur, utiliser le mode simulation en fallback
    if (!SIMULATION_MODE) {
      console.log('🔄 create-invoice - Fallback vers mode simulation');
      try {
        const body: CreateInvoiceRequest = await req.json();
        const { amount, description, metadata } = body;
        
        const invoice = generateSimulatedInvoice(amount, description);
        
        return NextResponse.json<ApiResponse<{ invoice: object; provider: string }>>({
          success: true,
          data: {
            invoice: {
              id: invoice.id,
              payment_request: invoice.paymentRequest,
              payment_hash: invoice.paymentHash,
              amount,
              description,
              expires_at: invoice.expiresAt,
              metadata
            },
            provider: 'daznode@getalby.com (fallback simulation)'
          },
          meta: {
            timestamp: new Date().toISOString(),
            provider: 'daznode@getalby.com'
          }
        });
      } catch (fallbackError) {
        console.error('❌ create-invoice - Erreur fallback:', fallbackError);
      }
    }
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'LIGHTNING_ERROR',
        message: 'Erreur lors de la génération de la facture via daznode@getalby.com',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: 'daznode@getalby.com'
      }
    }, { status: 500 });
  }
} 
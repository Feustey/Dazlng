import { NextRequest, NextResponse } from 'next/server';
import { createDazNodeLightningService } from '@/lib/services/daznode-lightning-service';

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

    // Utilisation du service Lightning daznode@getalby.com
    const lightningService = createDazNodeLightningService();
    
    const invoice = await lightningService.generateInvoice({
      amount,
      description,
      expiry: 3600 // 1 heure
    });
    
    console.log('✅ create-invoice - Facture créée via daznode@getalby.com:', {
      id: invoice.id,
      paymentHash: invoice.paymentHash,
      paymentRequestLength: invoice.paymentRequest?.length
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
        provider: 'daznode@getalby.com'
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: 'daznode@getalby.com'
      }
    });
    
  } catch (error) {
    console.error('❌ create-invoice - Erreur daznode@getalby.com:', error);
    
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
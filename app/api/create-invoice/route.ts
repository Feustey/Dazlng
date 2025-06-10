import { NextRequest, NextResponse } from 'next/server';
import { createUnifiedLightningService } from '@/lib/services/unified-lightning-service';

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

interface CreateInvoiceRequest {
  amount: number;
  description: string;
  metadata?: Record<string, any>;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

export async function POST(req: NextRequest): Promise<Response> {
  console.log('create-invoice v2.0 - Nouvelle requête');
  
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
          version: '2.0'
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
          version: '2.0'
        }
      }, { status: 400 });
    }

    console.log('create-invoice v2.0 - Paramètres validés:', { amount, description });

    // Utilisation du service Lightning unifié (DazNode ou LND)
    const lightningService = createUnifiedLightningService();
    
    const invoice = await lightningService.generateInvoice({
      amount,
      description,
      expiry: 3600 // 1 heure
    });
    
    console.log('create-invoice v2.0 - Facture créée avec succès:', {
      id: invoice.id,
      paymentHash: invoice.paymentHash,
      paymentRequestLength: invoice.paymentRequest?.length
    });

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: {
        invoice: {
          id: invoice.id,
          payment_request: invoice.paymentRequest,
          payment_hash: invoice.paymentHash,
          amount,
          description,
          expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
          metadata
        }
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0'
      }
    });
    
  } catch (error) {
    console.error('create-invoice v2.0 - Erreur:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur lors de la génération de la facture',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0'
      }
    }, { status: 500 });
  }
} 
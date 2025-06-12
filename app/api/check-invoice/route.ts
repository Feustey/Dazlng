import { NextRequest, NextResponse } from 'next/server';
import { createDazNodeLightningService } from '@/lib/services/daznode-lightning-service';

// Headers CORS pour permettre les requêtes depuis le navigateur
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS(): Promise<Response> {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
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

export async function GET(req: NextRequest): Promise<Response> {
  console.log('🔍 check-invoice - Vérification via daznode@getalby.com');
  
  try {
    const { searchParams } = new URL(req.url);
    const invoiceId = searchParams.get('id');
    const paymentHash = searchParams.get('payment_hash');

    // Validation des paramètres d'entrée
    if (!invoiceId && !paymentHash) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ID de facture ou payment_hash requis'
        },
        meta: {
          timestamp: new Date().toISOString(),
          provider: 'daznode@getalby.com'
        }
      }, { status: 400 });
    }

    console.log('✅ check-invoice - Paramètres validés:', { invoiceId, paymentHash });

    // Utilisation du service Lightning daznode@getalby.com
    const lightningService = createDazNodeLightningService();
    
    // Vérifier le statut du paiement
    const paymentStatus = await lightningService.checkInvoiceStatus(invoiceId || paymentHash!);
    
    console.log('✅ check-invoice - Statut vérifié via daznode@getalby.com:', {
      identifier: invoiceId || paymentHash,
      status: paymentStatus.status,
      settled: paymentStatus.status === 'settled'
    });

    return NextResponse.json<ApiResponse<any>>({
      success: true,
      data: {
        status: paymentStatus.status,
        settled: paymentStatus.status === 'settled',
        amount: paymentStatus.amount,
        payment_hash: paymentHash,
        settled_at: paymentStatus.settledAt,
        invoice_id: invoiceId,
        details: paymentStatus,
        provider: 'daznode@getalby.com'
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: 'daznode@getalby.com'
      }
    });
    
  } catch (error) {
    console.error('❌ check-invoice - Erreur daznode@getalby.com:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'LIGHTNING_ERROR',
        message: 'Erreur lors de la vérification via daznode@getalby.com',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: 'daznode@getalby.com'
      }
    }, { status: 500 });
  }
}

export async function POST(): Promise<Response> {
  return NextResponse.json({ error: 'LND non disponible sur ce déploiement.' }, { 
    status: 501, 
    headers: corsHeaders 
  });
} 
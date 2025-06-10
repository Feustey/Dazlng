import { NextRequest, NextResponse } from 'next/server';
import { createUnifiedLightningService } from '@/lib/services/unified-lightning-service';

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
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

export async function GET(req: NextRequest): Promise<Response> {
  console.log('check-invoice v2.0 - Nouvelle requête');
  
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
          version: '2.0'
        }
      }, { status: 400 });
    }

    console.log('check-invoice v2.0 - Paramètres validés:', { invoiceId, paymentHash });

    // Utilisation du service Lightning unifié (DazNode ou LND)
    const lightningService = createUnifiedLightningService();
    
    // Vérifier le statut du paiement
    const paymentStatus = await lightningService.checkInvoiceStatus(invoiceId || paymentHash!);
    
    console.log('check-invoice v2.0 - Statut vérifié avec succès:', {
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
        details: paymentStatus
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0'
      }
    });
    
  } catch (error) {
    console.error('check-invoice v2.0 - Erreur:', error);
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur lors de la vérification du paiement',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0'
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
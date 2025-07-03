import { NextRequest, NextResponse } from 'next/server';
import { createDazNodeLightningService } from '@/lib/services/daznode-lightning-service';
import { createLightningService } from '@/lib/services/lightning-service';
import { validateData, checkInvoiceSchema } from '@/lib/validations/lightning';
import { ApiResponse } from '@/lib/api-response';
import { PaymentLogger } from '@/lib/services/payment-logger';
import type { InvoiceStatus } from '@/types/lightning';

// Headers CORS pour permettre les requêtes depuis le navigateur
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS(): Promise<Response> {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
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
    const identifier = invoiceId || paymentHash;
    if (!identifier) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: 'invoice_id ou payment_hash requis'
        }
      }, { status: 400 });
    }

    const paymentStatus = await lightningService.checkInvoiceStatus(identifier);

    // Vérification de la structure de paymentStatus
    if (!paymentStatus || typeof paymentStatus !== 'object' || !('status' in paymentStatus)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'LIGHTNING_ERROR',
          message: 'Statut de facture invalide ou inconnu',
          details: paymentStatus
        },
        meta: {
          timestamp: new Date().toISOString(),
          provider: 'daznode@getalby.com'
        }
      }, { status: 500 });
    }

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

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

/**
 * POST /api/check-invoice
 * Vérifie le statut d'une facture Lightning
 */
export async function POST(request: Request) {
  try {
    // Récupération et validation des données
    const body = await request.json();
    const validation = validateData(checkInvoiceSchema, body);

    if (!validation.success) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Données invalides',
          details: validation.error.format()
        },
        meta: {
          timestamp: new Date().toISOString(),
          provider: 'daznode@getalby.com'
        }
      }, { status: 400 });
    }

    // Vérification du statut
    const lightningService = createLightningService();
    const status = await lightningService.checkInvoiceStatus(validation.data.paymentHash);

    // Mise à jour du log de paiement
    const paymentLogger = new PaymentLogger();
    await paymentLogger.updatePaymentStatus(validation.data.paymentHash, status.status as any);

    // Réponse formatée
    return NextResponse.json<ApiResponse<InvoiceStatus>>({
      success: true,
      data: status,
      meta: {
        timestamp: new Date().toISOString(),
        provider: 'daznode@getalby.com'
      }
    });

  } catch (error) {
    console.error('❌ check-invoice - Erreur:', error);

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: error instanceof Error ? error.message : 'Erreur interne du serveur',
      },
      meta: {
        timestamp: new Date().toISOString(),
        provider: 'daznode@getalby.com'
      }
    }, { status: 500 });
  }
}

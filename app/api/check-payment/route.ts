import { NextRequest, NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/order-service';
import { rateLimit } from '@/lib/rate-limit';
import { handleApiError, createApiResponse } from '@/lib/api-response';
import { createDaznoApiClient } from '@/lib/services/dazno-api';
import { logger } from '@/lib/logger';

// Rate limiter : 60 requêtes par minute
const rateLimiter = rateLimit({
  maxRequests: 60,
  windowMs: 60000
});

export async function GET(req: NextRequest) {
  try {
    // 1. Rate limiting
    const rateLimitResponse = await rateLimiter(req);
    if (rateLimitResponse) return rateLimitResponse;

    // 2. Récupérer l'ID de commande
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order');

    if (!orderId) {
      return createApiResponse({
        success: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'ID de commande requis'
        }
      }, 400);
    }

    // 3. Récupérer la commande
    const orderService = new OrderService();
    const order = await orderService.getOrder(orderId);

    if (!order) {
      return createApiResponse({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Commande introuvable'
        }
      }, 404);
    }

    // 4. Si déjà payée, retourner le statut
    if (order.status === 'paid') {
      return createApiResponse({
        success: true,
        data: {
          status: 'settled',
          paidAt: order.paid_at
        }
      });
    }

    // 5. Vérifier le paiement
    if (!order.payment_hash) {
      return createApiResponse({
        success: false,
        error: {
          code: 'PAYMENT_NOT_FOUND',
          message: 'Aucun paiement associé à cette commande'
        }
      }, 400);
    }

    const daznoApi = createDaznoApiClient();
    
    const status = await daznoApi.checkPayment(order.payment_hash);
    
    // 6. Si payé, mettre à jour la commande
    if ((status as unknown as string) === 'settled') {
      await orderService.markOrderPaid(orderId);
    }

    return createApiResponse({
      success: true,
      data: {
        status,
        paidAt: (status as unknown as string) === 'settled' ? new Date().toISOString() : null
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}

// Rate limiting simplifié
let requestCount = 0;
let lastReset = Date.now();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  if (now - lastReset >= 60000) { // 60 secondes
    requestCount = 0;
    lastReset = now;
  }

  if (requestCount >= 60) { // 60 requêtes max
    return false;
  }

  requestCount++;
  return true;
}

export async function POST(req: Request) {
  try {
    const { paymentHash } = await req.json();

    if (!paymentHash) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'VALIDATION_ERROR',
            message: 'Payment hash is required' 
          } 
        },
        { status: 400 }
      );
    }

    const daznoApi = createDaznoApiClient({
      apiKey: process.env.DAZNO_API_KEY,
    });

    const status = await daznoApi.checkPayment(paymentHash);

    return NextResponse.json({
      success: true,
      data: { status },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }
    });
  } catch (error) {
    logger.error('Error checking payment:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: error instanceof Error ? error.message : 'An error occurred while checking the payment',
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }
      },
      { status: 500 }
    );
  }
}

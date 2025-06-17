import { NextRequest } from 'next/server';
import { createUnifiedLightningService } from '@/lib/services/unified-lightning-service';
import { OrderService } from '@/lib/services/order-service';
import { rateLimit } from '@/lib/rate-limit';
import { handleApiError, createApiResponse } from '@/lib/api-response';
import { InvoiceStatus } from '@/types/lightning';

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
          status: 'settled' as InvoiceStatus,
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

    const lightningService = createUnifiedLightningService();
    const status = await lightningService.checkInvoiceStatus(order.payment_hash);

    // 6. Si payé, mettre à jour la commande
    if (status === 'settled') {
      await orderService.markOrderPaid(orderId);
    }

    return createApiResponse({
      success: true,
      data: {
        status,
        paidAt: status === 'settled' ? new Date().toISOString() : null
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
} 
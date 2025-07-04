import { NextResponse } from 'next/server';
import { OrderService } from '@/lib/services/order-service';

export interface LNbitsWebhookPayload {
  payment_hash: string;
  amount: number;
  fee?: number;
  memo?: string;
  time: number;
  bolt11: string;
  preimage?: string;
  webhook_id?: string;
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as LNbitsWebhookPayload;
    
    if (!payload.payment_hash) {
      return NextResponse.json({ error: 'Payment hash requis' }, { status: 400 });
    }

    const _orderService = new OrderService();
    // await _orderService.handlePaymentWebhook(payload.payment_hash);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erreur webhook LNbits:', error);
    return NextResponse.json(
      { error: 'Erreur lors du traitement du webhook' },
      { status: 500 }
);
  }
}

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS(_req: Request): Promise<Response> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "route.routerouteaccesscontrolallowor": '*',
      "route.routerouteaccesscontrolallowme": 'POST, OPTIONS',
      "route.routerouteaccesscontrolallowhe": 'Content-Type, X-Api-Key',
    },
  });
}

export const dynamic = "force-dynamic";

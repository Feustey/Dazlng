import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

interface LNbitsWebhookPayload {
  payment_hash: string;
  amount: number; // en millisats
  fee?: number;
  memo?: string;
  time: number; // timestamp
  bolt11: string;
  preimage?: string;
  webhook_id?: string;
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    console.log('LNbits Webhook - Début traitement');
    
    // Vérification de l'authentification du webhook
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey || apiKey !== process.env.LNBITS_WEBHOOK_SECRET) {
      console.error('LNbits Webhook - Clé API invalide');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload: LNbitsWebhookPayload = await req.json();
    console.log('LNbits Webhook - Payload reçu:', {
      payment_hash: payload.payment_hash,
      amount: payload.amount,
      memo: payload.memo
    });

    // Validation du payload
    if (!payload.payment_hash || !payload.amount) {
      console.error('LNbits Webhook - Payload invalide:', payload);
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // Conversion millisats en sats
    const amountSats = Math.floor(payload.amount / 1000);
    
    // Rechercher la commande correspondante
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .or(`payment_hash.eq.${payload.payment_hash},metadata->>payment_hash.eq.${payload.payment_hash}`)
      .eq('payment_status', false);

    if (ordersError) {
      console.error('LNbits Webhook - Erreur recherche commande:', ordersError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!orders || orders.length === 0) {
      console.warn('LNbits Webhook - Aucune commande trouvée pour payment_hash:', payload.payment_hash);
      // Ce n'est pas forcément une erreur, le paiement peut être pour autre chose
      return NextResponse.json({ message: 'No matching order found' }, { status: 200 });
    }

    const order = orders[0];
    console.log('LNbits Webhook - Commande trouvée:', {
      orderId: order.id,
      amount: order.amount,
      productType: order.product_type
    });

    // Vérification du montant
    if (amountSats !== order.amount) {
      console.error('LNbits Webhook - Montant incorrect:', {
        expected: order.amount,
        received: amountSats
      });
      // On continue quand même le processus mais on log l'erreur
    }

    // Mettre à jour la commande
    const updateData = {
      payment_status: true,
      payment_hash: payload.payment_hash,
      metadata: {
        ...order.metadata,
        payment_received_at: new Date().toISOString(),
        lnbits_webhook_data: {
          payment_hash: payload.payment_hash,
          amount: payload.amount,
          fee: payload.fee,
          memo: payload.memo,
          time: payload.time,
          preimage: payload.preimage
        }
      },
      updated_at: new Date().toISOString()
    };

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', order.id);

    if (updateError) {
      console.error('LNbits Webhook - Erreur mise à jour commande:', updateError);
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
    }

    console.log('LNbits Webhook - Commande mise à jour avec succès:', order.id);

    // Traitement post-paiement selon le type de produit
    await processOrderPostPayment(order, payload);

    // Envoyer une notification email au client
    await sendPaymentConfirmationEmail(order, payload);

    return NextResponse.json({ 
      message: 'Payment processed successfully',
      order_id: order.id,
      amount: amountSats
    });

  } catch (error) {
    console.error('LNbits Webhook - Erreur:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * Traitement post-paiement selon le type de produit
 */
async function processOrderPostPayment(order: Record<string, unknown>, payment: LNbitsWebhookPayload): Promise<void> {
  try {
    console.log('Post-payment processing pour:', order.product_type);

    switch (order.product_type) {
      case 'dazbox':
        await processDazBoxOrder(order, payment);
        break;
      case 'daznode':
        await processDazNodeOrder(order, payment);
        break;
      case 'dazpay':
        await processDazPayOrder(order, payment);
        break;
      case 'subscription':
        await processSubscriptionOrder(order, payment);
        break;
      default:
        console.warn('Type de produit non reconnu:', order.product_type);
    }

  } catch (error) {
    console.error('Erreur lors du traitement post-paiement:', error);
    // Ne pas faire échouer le webhook pour ça
  }
}

/**
 * Traitement spécifique DazBox
 */
async function processDazBoxOrder(order: Record<string, unknown>, payment: LNbitsWebhookPayload): Promise<void> {
  console.log('Traitement commande DazBox:', order.id);
  
  const metadata = (order.metadata as Record<string, unknown>) || {};
  
  // Créer une entrée de livraison
  const deliveryData = {
    order_id: order.id,
    address: metadata.delivery_address as string || 'Adresse non fournie',
    city: metadata.city as string || '',
    zip_code: metadata.zip_code as string || '',
    country: metadata.country as string || 'FR',
    shipping_status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('deliveries')
    .insert([deliveryData]);

  if (error) {
    console.error('Erreur création livraison:', error);
  } else {
    console.log('Livraison créée pour DazBox:', order.id);
  }

  // Notifier l'équipe d'expédition
  await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      to: 'shipping@dazno.de',
      subject: `📦 Nouvelle commande DazBox à expédier - ${order.id}`,
      text: `
Une nouvelle commande DazBox a été payée et doit être expédiée:

Commande: ${order.id}
Montant: ${Math.floor(payment.amount / 1000)} sats
Client: ${metadata.email as string || 'Non fourni'}
Adresse: ${metadata.delivery_address as string || 'Non fournie'}

Veuillez préparer l'expédition.
      `
    })
  });
}

/**
 * Traitement spécifique DazNode
 */
async function processDazNodeOrder(order: Record<string, unknown>, _payment: LNbitsWebhookPayload): Promise<void> {
  console.log('Traitement commande DazNode:', order.id);
  
  const metadata = (order.metadata as Record<string, unknown>) || {};
  
  // Créer l'abonnement ou activer les services
  const subscriptionData = {
    user_id: order.user_id,
    plan_id: metadata.plan as string || 'basic',
    status: 'active',
    start_date: new Date().toISOString(),
    end_date: metadata.billing_cycle === 'yearly' 
      ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('subscriptions')
    .insert([subscriptionData]);

  if (error) {
    console.error('Erreur création abonnement:', error);
  } else {
    console.log('Abonnement DazNode créé:', order.id);
  }
}

/**
 * Traitement spécifique DazPay
 */
async function processDazPayOrder(order: Record<string, unknown>, _payment: LNbitsWebhookPayload): Promise<void> {
  console.log('Traitement commande DazPay:', order.id);
  // Logique spécifique à DazPay
}

/**
 * Traitement spécifique abonnements
 */
async function processSubscriptionOrder(order: Record<string, unknown>, _payment: LNbitsWebhookPayload): Promise<void> {
  console.log('Traitement abonnement:', order.id);
  // Logique spécifique aux abonnements
}

/**
 * Envoie un email de confirmation de paiement
 */
async function sendPaymentConfirmationEmail(order: Record<string, unknown>, payment: LNbitsWebhookPayload): Promise<void> {
  try {
    const metadata = (order.metadata as Record<string, unknown>) || {};
    const customerEmail = metadata.email as string;
    if (!customerEmail) {
      console.warn('Pas d\'email client pour la confirmation:', order.id);
      return;
    }

    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: customerEmail,
        subject: `✅ Paiement confirmé - Commande ${order.id}`,
        text: `
Bonjour,

Votre paiement Lightning a été confirmé avec succès !

Détails de la commande:
- Numéro: ${order.id}
- Produit: ${order.product_type}
- Montant: ${Math.floor(payment.amount / 1000)} sats
- Date: ${new Date().toLocaleDateString('fr-FR')}

${order.product_type === 'dazbox' ? 
  'Votre DazBox sera expédiée sous 24-48h. Vous recevrez un email avec le numéro de suivi.' :
  'Votre service sera activé sous peu.'
}

Merci pour votre confiance !

L'équipe DazNode
        `
      })
    });

    console.log('Email de confirmation envoyé à:', customerEmail);

  } catch (error) {
    console.error('Erreur envoi email confirmation:', error);
  }
}

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS(_req: NextRequest): Promise<Response> {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Api-Key',
    },
  });
} 
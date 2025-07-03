import { createUnifiedLightningService } from '../lib/services/unified-lightning-service';
import { OrderService } from '../lib/services/order-service';
import type { UnifiedInvoiceStatusResponse } from '../lib/services/unified-lightning-service';

async function testPayment() {
  try {
    console.log('🚀 Test de paiement DazBox...');

    // Créer une instance du service de commande
    const orderService = new OrderService();

    // 1. Création de la commande
    console.log('\n1. Création de la commande...');
    const order = await orderService.createOrder({
      product_type: 'dazbox',
      amount: 50000,
      customer: {
        name: 'Test User',
        email: 'test@example.com'
      },
      plan: 'basic'
    });
    console.log('✅ Commande créée:', order.id);

    // 2. Génération de la facture
    console.log('\n2. Génération de la facture...');
    const orderRef = `${order.id.substring(0, 8)}-${Date.now().toString(36)}`;
    const lightningService = createUnifiedLightningService();
    const invoice = await lightningService.generateInvoice({
      amount: order.amount,
      description: `DazBox - BASIC - ${orderRef}`,
      metadata: { order_id: order.id, order_ref: orderRef }
    });
    console.log('✅ Facture générée:', invoice.paymentRequest);

    // 3. Mise à jour de la commande
    console.log('\n3. Mise à jour de la commande...');
    await orderService.updateOrder(order.id, {
      payment_hash: invoice.paymentHash,
      payment_request: invoice.paymentRequest,
      order_ref: orderRef
    });
    console.log('✅ Commande mise à jour');

    // 4. Surveillance du paiement
    console.log('\n4. Surveillance du paiement...');
    let attempts = 0;
    const maxAttempts = 240;
    const checkInterval = 3000;

    const checkPayment = async (): Promise<void> => {
      try {
        const status: UnifiedInvoiceStatusResponse = await lightningService.watchInvoice(invoice.paymentHash, {
          timeout: checkInterval,
          interval: 1000
        });

        if (status.status === 'settled' as any) {
          await orderService.markOrderPaid(order.id);
          console.log('✅ Paiement reçu !');
          return;
        }

        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error('Timeout: Paiement non reçu dans le délai imparti');
        }

        // Continuer la surveillance
        setTimeout(checkPayment, checkInterval);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        console.error('❌ Erreur:', errorMessage);
        throw error;
      }
    };

    await checkPayment();

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
    console.error('❌ Erreur:', errorMessage);
    process.exit(1);
  }
}

testPayment(); 
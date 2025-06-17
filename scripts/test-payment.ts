import { createUnifiedLightningService } from '../lib/services/unified-lightning-service';
import { createOrder, updateOrder, markOrderPaid } from '../lib/services/order-service';

async function testPayment() {
  try {
    console.log('🚀 Test de paiement DazBox...');

    // 1. Création de la commande
    console.log('\n1. Création de la commande...');
    const order = await createOrder({
      product: 'dazbox',
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
    await updateOrder(order.id, {
      payment_hash: invoice.paymentHash,
      payment_request: invoice.paymentRequest,
      order_ref: orderRef
    });
    console.log('✅ Commande mise à jour');

    // 4. Surveillance du paiement
    console.log('\n4. Surveillance du paiement...');
    await new Promise((resolve, reject) => {
      lightningService.watchInvoiceWithRenewal(invoice, {
        checkInterval: 3000,
        maxAttempts: 240,
        onPaid: async () => {
          await markOrderPaid(order.id);
          console.log('✅ Paiement reçu !');
          resolve(true);
        },
        onExpired: () => {
          console.log('⚠️ Facture expirée');
          reject(new Error('Facture expirée'));
        },
        onError: (error) => {
          console.error('❌ Erreur:', error);
          reject(error);
        },
        onRenewing: () => {
          console.log('🔄 Renouvellement de la facture...');
        },
        onRenewed: (newInvoice) => {
          console.log('✅ Nouvelle facture générée:', newInvoice.paymentRequest);
        }
      });
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

testPayment(); 
import { LightningAddress } from '@getalby/lightning-tools';

interface InvoiceParams {
  amount: number;
  memo: string;
}

interface Invoice {
  paymentRequest: string;
  paymentHash: string;
}

export async function generateInvoice({ amount, memo }: InvoiceParams): Promise<Invoice> {
  const lightningAddress = process.env.ALBY_LIGHTNING_ADDRESS;
  if (!lightningAddress || typeof lightningAddress !== 'string' || !lightningAddress.includes('@')) {
    throw new Error("La variable d'environnement ALBY_LIGHTNING_ADDRESS est absente ou invalide. Veuillez la définir dans votre .env, exemple : ALBY_LIGHTNING_ADDRESS=tonadresse@tondomaine.com");
  }
  const apiKey = process.env.ALBY_API_KEY;
  if (!apiKey) {
    throw new Error("La variable d'environnement ALBY_API_KEY est absente. Veuillez la définir dans votre .env");
  }

  // Appel direct à l'API Alby pour générer une facture
  const response = await fetch('https://api.getalby.com/invoices', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      amount: amount.toString(),
      description: memo,
      lightning_address: lightningAddress,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error('Erreur lors de la création de la facture: ' + error);
  }

  const data = await response.json();
  return {
    paymentRequest: data.payment_request,
    paymentHash: data.payment_hash,
  };
}

export async function checkPayment(paymentHash: string): Promise<boolean> {
  const response = await fetch('/api/check-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentHash }),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la vérification du paiement');
  }

  const data = await response.json();
  return data.paid === true;
} 
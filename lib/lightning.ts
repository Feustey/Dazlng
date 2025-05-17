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
  const address = new LightningAddress(process.env.LIGHTNING_ADDRESS as string);
  await address.fetch();

  const invoice = await address.requestInvoice({
    satoshi: amount,
    comment: memo,
  });

  return {
    paymentRequest: invoice.paymentRequest,
    paymentHash: invoice.paymentHash,
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
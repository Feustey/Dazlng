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
  try {
    const address = new LightningAddress(process.env.LIGHTNING_ADDRESS as string);
    await address.fetch();

    const lnurlPayEndpoint = address.lnurlpData?.callback;
    if (!lnurlPayEndpoint) {
      throw new Error('Endpoint LNURL-pay non disponible');
    }

    const response = await fetch(`${lnurlPayEndpoint}/paymentStatus/${paymentHash}`);
    const data = await response.json();
    return data.status === 'completed';
  } catch (error) {
    console.error('Erreur lors de la vérification du paiement:', error);
    throw new Error('Échec de la vérification du paiement');
  }
}

module.exports = {
  generateInvoice,
  checkPayment,
}; 
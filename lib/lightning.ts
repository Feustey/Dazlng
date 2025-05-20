interface InvoiceParams {
  amount: number;
  memo: string;
}

interface Invoice {
  id: string;
  paymentRequest: string;
  paymentHash?: string;
}

export async function generateInvoice({ amount, memo }: InvoiceParams): Promise<Invoice> {
  // Appel au nouvel endpoint Next.js
  const response = await fetch('/api/create-invoice', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, description: memo }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error('Erreur lors de la création de la facture: ' + error);
  }

  const data = await response.json();
  return {
    id: data.invoice.id,
    paymentRequest: data.invoice.payment_request,
    paymentHash: data.invoice.payment_hash,
  };
}

export async function checkPayment(invoiceId: string): Promise<boolean> {
  // Appel au nouvel endpoint Next.js
  const response = await fetch(`/api/check-invoice?id=${invoiceId}`);

  if (!response.ok) {
    throw new Error('Erreur lors de la vérification du paiement');
  }

  const data = await response.json();
  return data.status === 'settled';
} 
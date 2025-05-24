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
  // Ajout d'un timeout et d'un système de retry
  const fetchWithTimeout = (url: string, options: RequestInit, timeout = 10000): Promise<Response> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout de la requête')), timeout);
      fetch(url, options)
        .then(response => {
          clearTimeout(timer);
          resolve(response);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  };

  const maxRetries = 3;
  let lastError: any = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetchWithTimeout('/api/create-invoice', {
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
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        // Attendre un peu avant de réessayer (exponentiel)
        await new Promise(res => setTimeout(res, 500 * attempt));
      }
    }
  }
  throw new Error('Erreur lors de la création de la facture après plusieurs tentatives: ' + (lastError?.message || lastError));
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

export type { Invoice }; 
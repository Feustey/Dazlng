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
  console.log('generateInvoice - Début génération facture:', { amount, memo });
  
  // Validation des paramètres d'entrée
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    throw new Error(`Montant invalide: ${amount}`);
  }
  
  if (!memo || typeof memo !== 'string') {
    throw new Error(`Memo invalide: ${memo}`);
  }

  // Ajout d'un timeout et d'un système de retry
  const fetchWithTimeout = (url: string, options: RequestInit, timeout = 15000): Promise<Response> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Timeout de la requête (15s)')), timeout);
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
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`generateInvoice - Tentative ${attempt}/${maxRetries}`);
      
      const response = await fetchWithTimeout('/api/create-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, description: memo }),
      });
      
      console.log('generateInvoice - Réponse reçue:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('generateInvoice - Erreur HTTP:', response.status, errorText);
        throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('generateInvoice - Données reçues:', {
        hasInvoice: !!data.invoice,
        hasId: !!data.invoice?.id,
        hasPaymentRequest: !!data.invoice?.payment_request,
        hasPaymentHash: !!data.invoice?.payment_hash
      });
      
      // Vérification de la structure des données
      if (!data.invoice) {
        throw new Error('Réponse invalide: propriété "invoice" manquante');
      }
      
      if (!data.invoice.id) {
        throw new Error('Réponse invalide: propriété "id" manquante');
      }
      
      if (!data.invoice.payment_request) {
        throw new Error('Réponse invalide: propriété "payment_request" manquante');
      }
      
      const invoice = {
        id: data.invoice.id,
        paymentRequest: data.invoice.payment_request,
        paymentHash: data.invoice.payment_hash,
      };
      
      console.log('generateInvoice - Facture créée avec succès:', {
        id: invoice.id,
        paymentHash: invoice.paymentHash,
        paymentRequestLength: invoice.paymentRequest?.length
      });
      
      return invoice;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      console.error(`generateInvoice - Erreur tentative ${attempt}:`, lastError.message);
      
      if (attempt < maxRetries) {
        const delay = 500 * attempt;
        console.log(`generateInvoice - Attente ${delay}ms avant nouvelle tentative`);
        await new Promise(res => setTimeout(res, delay));
      }
    }
  }
  
  const finalError = new Error(`Erreur lors de la création de la facture après ${maxRetries} tentatives: ${lastError?.message || lastError}`);
  console.error('generateInvoice - Échec final:', finalError.message);
  throw finalError;
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
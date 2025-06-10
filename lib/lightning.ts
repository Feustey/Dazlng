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
  console.log('generateInvoice v2.0 - Génération via API Lightning:', { amount, memo });
  
  // Validation des paramètres d'entrée
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    throw new Error(`Montant invalide: ${amount}`);
  }
  
  if (!memo || typeof memo !== 'string') {
    throw new Error(`Memo invalide: ${memo}`);
  }

  try {
    // Utilisation uniquement de l'API pour éviter les problèmes côté client
    const response = await fetch('/api/create-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, description: memo }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur API: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    
    // Support du nouveau format de réponse
    if (data.success && data.data?.invoice) {
      const result = {
        id: data.data.invoice.id,
        paymentRequest: data.data.invoice.payment_request,
        paymentHash: data.data.invoice.payment_hash,
      };
      
      console.log('generateInvoice v2.0 - Facture créée avec succès:', {
        id: result.id,
        paymentHash: result.paymentHash,
        paymentRequestLength: result.paymentRequest?.length
      });
      
      return result;
    }
    
    // Support de l'ancien format pour compatibilité
    if (data.invoice) {
      const result = {
        id: data.invoice.id,
        paymentRequest: data.invoice.payment_request,
        paymentHash: data.invoice.payment_hash,
      };
      
      console.log('generateInvoice v2.0 - Facture créée avec succès (format legacy):', {
        id: result.id,
        paymentHash: result.paymentHash,
        paymentRequestLength: result.paymentRequest?.length
      });
      
      return result;
    }
    
    throw new Error('Format de réponse API invalide');
    
  } catch (error) {
    console.error('generateInvoice v2.0 - Erreur:', error);
    throw error;
  }
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
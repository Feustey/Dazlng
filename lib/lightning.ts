export interface InvoiceParams {
  amount: number;
  memo: string;
}

export interface Invoice {
  id: string;
  paymentRequest: string;
  paymentHash: string;
}

export async function generateInvoice({ amount, memo }: InvoiceParams): Promise<Invoice> {
  console.log('generateInvoice v2.0 - Génération via API Lightning:', { amount, memo });
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    const response = await fetch(`${baseUrl}/api/create-invoice`, {
      method: 'POST',
      headers: { 
        "lightning.lightninglightningcontenttype": 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ amount, description: memo }),
      credentials: 'include' // Important pour les cookies d'authentification
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `Erreur API: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data?.invoice) {
      throw new Error(data.error?.message || 'Erreur lors de la création de la facture');
    }
    
    return {
      id: data.data.invoice.id,
      paymentRequest: data.data.invoice.payment_request,
      paymentHash: data.data.invoice.payment_hash,
    };
  } catch (error) {
    console.error('❌ generateInvoice - Erreur:', error);
    throw error;
  }
}

export async function checkPayment(invoiceId: string): Promise<boolean> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
  const response = await fetch(`${baseUrl}/api/check-invoice?id=${invoiceId}`);

  if (!response.ok) {
    throw new Error('Erreur lors de la vérification du paiement');
  }

  const data = await response.json();
  return data.status === 'settled';
} 
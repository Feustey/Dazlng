export interface AlbyInvoice {
  payment_hash: string;
  payment_request: string;
  amount: number;
  expires_at?: string;
  status?: string;
}

/**
 * Crée une facture pour un paiement Lightning avec Alby
 * @param amount Montant en sats
 * @param description Description du paiement
 * @returns Facture Alby
 */
export async function createInvoice(
  amount: number,
  description: string = "Paiement Dazbox"
): Promise<AlbyInvoice> {
  try {
    const response = await fetch("/api/checkout/payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, description }),
    });

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la création de la facture: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.invoice;
  } catch (error) {
    console.error("Erreur dans createInvoice:", error);
    throw error;
  }
}

/**
 * Vérifie si une facture a été payée
 * @param paymentHash Hash du paiement à vérifier
 * @returns true si le paiement est effectué, false sinon
 */
export async function checkInvoiceStatus(
  paymentHash: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/check-payment?payment_hash=${paymentHash}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Erreur lors de la vérification du paiement: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.paid === true;
  } catch (error) {
    console.error("Erreur dans checkInvoiceStatus:", error);
    throw error;
  }
}

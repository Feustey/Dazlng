import { NextResponse } from "next/server";

// Implémentation simulée de supabase
const supabase = {
  from: (table: string) => {
    return {
      insert: (data: any) => ({
        select: () => ({
          single: () => ({
            data: { ...data, id: `mocked-id-${Date.now()}` },
            error: null,
          }),
        }),
      }),
      select: () => ({
        eq: () => ({
          data: [
            {
              id: `mocked-id-${Date.now()}`,
              amount: 1000,
              description: "Test payment",
              payment_hash: "hash123",
              payment_request: "lnbc...",
              status: "pending",
            },
          ],
          error: null,
        }),
      }),
      update: () => ({
        eq: () => ({
          data: { status: "paid" },
          error: null,
        }),
      }),
    };
  },
};

// Implémentation simulée des services Alby
const createInvoice = async (amount: number, description: string) => {
  return {
    payment_hash: `hash-${Date.now()}`,
    payment_request: `lnbc${amount}...`,
    amount,
  };
};

const checkInvoiceStatus = async (paymentHash: string) => {
  return { paid: true, preimage: "preimage123" };
};

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { amount, description } = await request.json();

    // Créer une facture Alby
    const invoice = await createInvoice(amount, description);

    // Enregistrer la session de paiement dans Supabase
    const { data, error } = await supabase
      .from("checkout_sessions")
      .insert({
        amount,
        description,
        payment_hash: invoice.payment_hash,
        payment_request: invoice.payment_request,
        status: "pending",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      ...invoice,
      session_id: data.id,
    });
  } catch (error) {
    console.error("Erreur lors du traitement du paiement:", error);
    return NextResponse.json(
      { error: "Erreur lors du traitement du paiement" },
      { status: 500 }
    );
  }
}

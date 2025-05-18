import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  const amount = body.amount ?? 300000; // en sats
  const description = body.description ?? 'Checkout payment';

  // Récupération des variables d'environnement Alby
  const ALBY_API_KEY = process.env.ALBY_API_KEY;
  const ALBY_LIGHTNING_ADDRESS = process.env.ALBY_LIGHTNING_ADDRESS;
  if (!ALBY_API_KEY || !ALBY_LIGHTNING_ADDRESS) {
    return NextResponse.json({ error: 'Clés Alby manquantes' }, { status: 500 });
  }

  // Appel à l'API Alby pour générer une facture
  const response = await fetch('https://api.getalby.com/invoices', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${ALBY_API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      amount: amount.toString(),
      description,
      lightning_address: ALBY_LIGHTNING_ADDRESS,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error: 'Erreur lors de la création de la facture', details: error }, { status: 500 });
  }

  const data = await response.json();
  return NextResponse.json({
    paymentRequest: data.payment_request,
    paymentHash: data.payment_hash,
    expires_at: data.expires_at,
  });
} 
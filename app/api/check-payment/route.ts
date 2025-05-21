import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<Response> {
  const { paymentHash } = await req.json();

  // Récupère le token API Alby depuis les variables d'environnement
  const ALBY_API_TOKEN = process.env.ALBY_API_TOKEN;
  if (!ALBY_API_TOKEN) {
    return NextResponse.json({ error: 'Token API Alby manquant' }, { status: 500 });
  }

  // Appel à l'API Alby pour vérifier le paiement
  const response = await fetch(`https://api.getalby.com/v1/invoices/${paymentHash}`, {
    headers: {
      Authorization: `Bearer ${ALBY_API_TOKEN}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Erreur lors de la vérification du paiement' }, { status: 500 });
  }

  const data = await response.json();
  // data.settled === true si payé
  return NextResponse.json({ paid: data.settled });
} 
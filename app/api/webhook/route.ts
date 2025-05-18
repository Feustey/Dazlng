import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // TODO: Vérifier la signature du webhook selon la doc Alby
  const event = await req.json();

  switch (event.type) {
    case 'invoice.settled':
      console.log('Paiement reçu!', event.data);
      // Logique métier ici
      break;
    case 'invoice.expired':
      console.log('Facture expirée', event.data);
      break;
    default:
      console.log('Événement non traité:', event.type);
  }

  return NextResponse.json({ status: 'ok' });
} 
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
  // TODO: Vérifier la signature du webhook selon la doc Alby
  const event = await req.json();

  switch (event.type) {
    case 'invoice.settled':
      // Logique métier ici
      break;
    case 'invoice.expired':
      break;
    default:
  }

  return NextResponse.json({ status: 'ok' });
} 
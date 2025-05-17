import { NextResponse } from 'next/server';
import { createInvoice } from 'ln-service';
import { lnd } from '@/app/lib/lnd';

export async function POST(req: Request) {
  const body = await req.json();
  const tokens = body.tokens ?? 300000; // 300k sats par défaut
  const description = body.description ?? 'Checkout payment';

  if (!tokens || !description) {
    return NextResponse.json({ error: 'tokens et description requis' }, { status: 400 });
  }

  const invoice = await createInvoice({ lnd, tokens, description });

  return NextResponse.json({
    request: invoice.request,
    id: invoice.id,
    expires_at: invoice.expires_at,
  });
} 
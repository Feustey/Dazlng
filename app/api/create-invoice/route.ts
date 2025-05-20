import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const { amount, description, successUrl } = await req.json();

  if (!amount || !description) {
    return NextResponse.json({ error: 'Le montant et la description sont requis' }, { status: 400 });
  }

  try {
    const ALBY_API_KEY = process.env.ALBY_API_KEY!;
    const ALBY_API_URL = 'https://api.getalby.com/';

    const invoiceData = {
      amount,
      description,
      success_url: successUrl || 'https://votresite.com/success',
    };

    const response = await axios.post(`${ALBY_API_URL}invoices`, invoiceData, {
      headers: {
        'Authorization': `Bearer ${ALBY_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json({
      invoice: response.data,
      paymentUrl: `lightning:${response.data.payment_request}`
    });
  } catch (error) {
    const err = error as { response?: { data?: unknown }; message?: string };
    // eslint-disable-next-line no-console
    console.error('Erreur lors de la création de la facture:', err.response?.data || err.message);
    return NextResponse.json({ error: 'Erreur lors de la création de la facture' }, { status: 500 });
  }
} 
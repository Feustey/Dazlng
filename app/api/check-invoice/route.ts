import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get('id');
  if (!invoiceId) {
    return NextResponse.json({ error: 'ID de facture manquant' }, { status: 400 });
  }

  try {
    const ALBY_API_KEY = process.env.ALBY_API_KEY!;
    const ALBY_API_URL = 'https://api.getalby.com/';

    const response = await axios.get(`${ALBY_API_URL}invoices/${invoiceId}`, {
      headers: {
        'Authorization': `Bearer ${ALBY_API_KEY}`
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Erreur lors de la vérification:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Erreur lors de la vérification de la facture' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return NextResponse.json({ error: 'LND non disponible sur ce déploiement.' }, { status: 501 });
} 
import { NextRequest, NextResponse } from 'next/server';
import { webln } from '@getalby/sdk';

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get('id');
  if (!invoiceId) {
    return NextResponse.json({ error: 'ID de facture manquant' }, { status: 400 });
  }

  try {
    const NWC_URL = process.env.NWC_URL || 'nostr+walletconnect://de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30?relay=wss://relay.getalby.com/v1&secret=b5264968ca3e66af8afc23934c2480c7b0e180c7c62bab55d14f012d9d541324';
    const nwc = new webln.NWC({ nostrWalletConnectUrl: NWC_URL });
    await nwc.enable();
    const invoice = await nwc.lookupInvoice({ paymentHash: invoiceId });
    nwc.close();
    return NextResponse.json({
      status: invoice.paid ? 'settled' : 'pending'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la vérification de la facture' }, { status: 500 });
  }
}

export async function POST(): Promise<Response> {
  return NextResponse.json({ error: 'LND non disponible sur ce déploiement.' }, { status: 501 });
} 
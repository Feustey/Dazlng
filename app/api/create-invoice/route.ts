import { NextRequest, NextResponse } from 'next/server';
import { webln } from '@getalby/sdk';

export async function POST(req: NextRequest): Promise<Response> {
  const { amount, description } = await req.json();

  // LOG DEBUG
  console.log('API create-invoice - amount:', amount, 'description:', description);

  if (!amount || !description) {
    return NextResponse.json({ error: 'Le montant et la description sont requis' }, { status: 400 });
  }

  let nwc;
  try {
    const NWC_URL = process.env.NWC_URL || 'nostr+walletconnect://de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30?relay=wss://relay.getalby.com/v1&secret=b5264968ca3e66af8afc23934c2480c7b0e180c7c62bab55d14f012d9d541324';
    nwc = new webln.NWC({ nostrWalletConnectUrl: NWC_URL });
    await nwc.enable();

    // Forcer le memo à être une string ASCII simple, sans caractères spéciaux
    let safeMemo = typeof description === 'string' ? description : '';
    safeMemo = safeMemo.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');
    if (!safeMemo) safeMemo = 'DazBox';

    console.log('API create-invoice - safeMemo:', safeMemo);

    const result = await nwc.makeInvoice({
      amount: Number(amount),
      defaultMemo: safeMemo,
    });

    return NextResponse.json({
      invoice: {
        id: result.paymentHash,
        payment_request: result.paymentRequest,
        payment_hash: result.paymentHash,
      },
      paymentUrl: `lightning:${result.paymentRequest}`
    });
  } catch (error) {
    const err = error as Error;
    console.error('Erreur lors de la création de la facture Lightning:', err);
    return NextResponse.json({ error: err.message || 'Erreur lors de la création de la facture' }, { status: 500 });
  } finally {
    if (nwc) {
      try { nwc.close(); } catch (e) {}
    }
  }
} 
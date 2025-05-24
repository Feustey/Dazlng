import { NextRequest, NextResponse } from 'next/server';
import { webln } from '@getalby/sdk';

// Headers CORS pour permettre les requêtes depuis le navigateur
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS(_req: NextRequest): Promise<Response> {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: NextRequest): Promise<Response> {
  const { amount, description } = await req.json();

  // LOG DEBUG
  console.log('API create-invoice - Début requête');
  console.log('API create-invoice - amount:', amount, 'description:', description);

  if (!amount || !description) {
    console.error('API create-invoice - Paramètres manquants:', { amount, description });
    return NextResponse.json({ error: 'Le montant et la description sont requis' }, { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  if (typeof amount !== 'number' || amount <= 0) {
    console.error('API create-invoice - Montant invalide:', amount);
    return NextResponse.json({ error: 'Le montant doit être un nombre positif' }, { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  let nwc;
  try {
    const NWC_URL = process.env.NWC_URL || 'nostr+walletconnect://de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30?relay=wss://relay.getalby.com/v1&secret=b5264968ca3e66af8afc23934c2480c7b0e180c7c62bab55d14f012d9d541324';
    
    console.log('API create-invoice - Initialisation NWC...');
    nwc = new webln.NWC({ nostrWalletConnectUrl: NWC_URL });
    await nwc.enable();
    console.log('API create-invoice - NWC activé avec succès');

    // Forcer le memo à être une string ASCII simple, sans caractères spéciaux
    let safeMemo = typeof description === 'string' ? description : '';
    safeMemo = safeMemo.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');
    if (!safeMemo) safeMemo = 'DazBox';

    console.log('API create-invoice - safeMemo:', safeMemo);
    console.log('API create-invoice - Création de la facture...');

    const result = await nwc.makeInvoice({
      amount: Number(amount),
      defaultMemo: safeMemo,
    });

    console.log('API create-invoice - Facture créée avec succès:', {
      paymentHash: result.paymentHash,
      paymentRequest: result.paymentRequest ? 'présent' : 'manquant'
    });

    // Le paymentHash peut être extrait du paymentRequest si absent
    let paymentHash = result.paymentHash;
    if (!paymentHash && result.paymentRequest) {
      // Extraire le payment hash depuis le payment request (Lightning Network)
      // Le payment hash est généralement dans la partie du bolt11
      paymentHash = `extracted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      console.log('API create-invoice - Payment hash extrait/généré:', paymentHash);
    }

    if (!result.paymentRequest) {
      console.error('API create-invoice - Réponse invalide de NWC:', result);
      throw new Error('Données de facture incomplètes reçues du service Lightning');
    }

    const response = {
      invoice: {
        id: paymentHash || `gen_${Date.now()}`,
        payment_request: result.paymentRequest,
        payment_hash: paymentHash,
      },
      paymentUrl: `lightning:${result.paymentRequest}`
    };

    console.log('API create-invoice - Réponse envoyée:', {
      ...response,
      invoice: {
        ...response.invoice,
        payment_request: response.invoice.payment_request ? 'présent' : 'manquant'
      }
    });

    return NextResponse.json(response, { headers: corsHeaders });
  } catch (error) {
    const err = error as Error;
    console.error('API create-invoice - Erreur lors de la création de la facture Lightning:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });

    // MODE TEST : Retourner une facture factice pour les tests
    console.log('API create-invoice - Mode test activé, génération d\'une facture factice');
    
    const mockPaymentHash = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mockPaymentRequest = `lnbc${amount}u1p0test123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz`;
    
    const testResponse = {
      invoice: {
        id: mockPaymentHash,
        payment_request: mockPaymentRequest,
        payment_hash: mockPaymentHash,
      },
      paymentUrl: `lightning:${mockPaymentRequest}`,
      isTest: true // Indicateur que c'est une facture de test
    };

    console.log('API create-invoice - Facture de test générée:', {
      paymentHash: mockPaymentHash,
      hasPaymentRequest: !!mockPaymentRequest
    });

    return NextResponse.json(testResponse, { headers: corsHeaders });
  } finally {
    if (nwc) {
      try { 
        console.log('API create-invoice - Fermeture de la connexion NWC');
        nwc.close(); 
      } catch (e) {
        console.warn('API create-invoice - Erreur lors de la fermeture NWC:', e);
      }
    }
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { webln } from '@getalby/sdk';

// Headers CORS pour permettre les requêtes depuis le navigateur
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Stockage en mémoire pour simuler les paiements de test
const testPayments = new Map<string, { createdAt: number; paid: boolean }>();

export async function OPTIONS(_req: NextRequest): Promise<Response> {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const invoiceId = searchParams.get('id');
  
  if (!invoiceId) {
    return NextResponse.json({ error: 'ID de facture manquant' }, { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  // Gérer les factures de test
  if (invoiceId.startsWith('mock_') || invoiceId.startsWith('extracted_') || invoiceId.startsWith('gen_')) {
    console.log('API check-invoice - Facture de test détectée:', invoiceId);
    
    // Initialiser le paiement de test s'il n'existe pas
    if (!testPayments.has(invoiceId)) {
      testPayments.set(invoiceId, { createdAt: Date.now(), paid: false });
    }
    
    const payment = testPayments.get(invoiceId);
    if (!payment) {
      return NextResponse.json({ error: 'Erreur interne' }, { 
        status: 500, 
        headers: corsHeaders 
      });
    }
    
    const timeSinceCreation = Date.now() - payment.createdAt;
    
    // Simuler un paiement réussi après 30 secondes (pour les tests)
    if (timeSinceCreation > 30000 && !payment.paid) {
      payment.paid = true;
      testPayments.set(invoiceId, payment);
    }
    
    return NextResponse.json({
      status: payment.paid ? 'settled' : 'pending',
      isTest: true,
      timeSinceCreation
    }, { headers: corsHeaders });
  }

  // Gérer les vraies factures Lightning
  let nwc;
  try {
    const NWC_URL = process.env.NWC_URL || 'nostr+walletconnect://de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30?relay=wss://relay.getalby.com/v1&secret=b5264968ca3e66af8afc23934c2480c7b0e180c7c62bab55d14f012d9d541324';
    nwc = new webln.NWC({ nostrWalletConnectUrl: NWC_URL });
    await nwc.enable();
    
    console.log('API check-invoice - Vérification facture réelle:', invoiceId);
    const invoice = await nwc.lookupInvoice({ paymentHash: invoiceId });
    
    return NextResponse.json({
      status: invoice.paid ? 'settled' : 'pending'
    }, { headers: corsHeaders });
  } catch (error) {
    const err = error as Error;
    console.error('API check-invoice - Erreur:', err.message);
    
    // Si la facture n'est pas trouvée, retourner un statut "not_found" au lieu d'une erreur 500
    if (err.message.includes('not found') || (err as { code?: string }).code === 'NOT_FOUND') {
      return NextResponse.json({ 
        status: 'not_found',
        error: 'Facture non trouvée'
      }, { 
        status: 200, // Retourner 200 avec un statut "not_found"
        headers: corsHeaders 
      });
    }
    
    return NextResponse.json({ 
      error: 'Erreur lors de la vérification de la facture',
      details: err.message 
    }, { 
      status: 500, 
      headers: corsHeaders 
    });
  } finally {
    if (nwc) {
      try {
        nwc.close();
      } catch (e) {
        console.warn('API check-invoice - Erreur lors de la fermeture NWC:', e);
      }
    }
  }
}

export async function POST(): Promise<Response> {
  return NextResponse.json({ error: 'LND non disponible sur ce déploiement.' }, { 
    status: 501, 
    headers: corsHeaders 
  });
} 
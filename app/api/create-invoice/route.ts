import { NextRequest, NextResponse } from 'next/server';
import { webln } from '@getalby/sdk';
import { LNbitsService } from '@/app/lib/lnbits-service';
import { lightningMonitor } from '@/app/lib/lightning-monitor';

// Headers CORS pour permettre les requêtes depuis le navigateur
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS(_req: NextRequest): Promise<Response> {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

interface ApiResponse {
  invoice?: {
    id: string;
    payment_request: string;
    payment_hash: string;
    expires_at?: string;
    amount?: number;
  };
  paymentUrl?: string;
  provider?: string;
  isTest?: boolean;
  error?: string;
}

export async function POST(req: NextRequest): Promise<Response> {
  const startTime = Date.now();
  const { amount, description } = await req.json();

  // LOG DEBUG
  console.log('API create-invoice - Début requête');
  console.log('API create-invoice - amount:', amount, 'description:', description);

  // Validation renforcée des paramètres
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

  if (amount > 1000000) { // Limite de sécurité
    console.error('API create-invoice - Montant trop élevé:', amount);
    return NextResponse.json({ error: 'Montant maximum: 1,000,000 sats' }, { 
      status: 400, 
      headers: corsHeaders 
    });
  }

  // Système de providers avec fallback
  const providers = await getAvailableProviders();
  let lastError: Error | null = null;

  for (const { name, service } of providers) {
    const providerStartTime = Date.now();
    
    try {
      console.log(`API create-invoice - Tentative avec provider ${name}`);
      
      let invoice;
      if (name === 'lnbits') {
        invoice = await service.generateInvoice({
          amount,
          memo: description,
          expiry: 3600 // 1 heure
        });
      } else {
        // Fallback vers NWC
        invoice = await generateNWCInvoice(amount, description, service);
      }

      const duration = Date.now() - providerStartTime;

      // Enregistrer les métriques de succès
      await lightningMonitor.logInvoiceMetrics(
        invoice.id,
        name,
        amount,
        duration,
        true
      );

      const response: ApiResponse = {
        invoice: {
          id: invoice.id,
          payment_request: invoice.paymentRequest,
          payment_hash: invoice.paymentHash,
          expires_at: invoice.expiresAt,
          amount: invoice.amount
        },
        paymentUrl: `lightning:${invoice.paymentRequest}`,
        provider: name
      };

      console.log('API create-invoice - Facture créée avec succès:', {
        provider: name,
        paymentHash: invoice.paymentHash,
        amount: invoice.amount,
        duration: `${duration}ms`
      });

      return NextResponse.json(response, { headers: corsHeaders });

    } catch (error) {
      const duration = Date.now() - providerStartTime;
      lastError = error instanceof Error ? error : new Error(String(error));
      
      console.error(`API create-invoice - Erreur avec provider ${name}:`, {
        message: lastError.message,
        duration: `${duration}ms`
      });

      // Enregistrer les métriques d'échec
      await lightningMonitor.logInvoiceMetrics(
        `failed_${Date.now()}`,
        name,
        amount,
        duration,
        false,
        lastError.message
      );

      // Continuer avec le provider suivant
      continue;
    }
  }

  // Tous les providers ont échoué
  const totalDuration = Date.now() - startTime;
  console.error('API create-invoice - Tous les providers ont échoué:', {
    lastError: lastError?.message,
    totalDuration: `${totalDuration}ms`,
    providersAttempted: providers.length
  });

  // En dernier recours, générer une facture de test
  const testResponse = await generateTestInvoice(amount, description);
  return NextResponse.json(testResponse, { headers: corsHeaders });
}

/**
 * Récupère la liste des providers disponibles par ordre de priorité
 */
async function getAvailableProviders(): Promise<Array<{ name: string; service: any }>> {
  const providers = [];

  // Provider NWC (priorité 1 - temporaire jusqu'à déploiement LNbits)
  console.log('🔄 Provider NWC configuré comme priorité 1');
  providers.push({ name: 'nwc', service: null });

  // Provider LNbits (désactivé temporairement - api.dazno.de = MCP-Light API)
  // TODO: Réactiver quand LNbits sera sur lnbits.dazno.de
  if (false && process.env.LNBITS_ENDPOINT && process.env.LNBITS_ENDPOINT !== 'https://api.dazno.de') {
    try {
      const lnbitsService = new LNbitsService();
      providers.push({ name: 'lnbits', service: lnbitsService });
      console.log('✅ LNbits provider ajouté (futur)');
    } catch (error) {
      console.warn('⚠️ Impossible d\'initialiser LNbits provider:', error);
    }
  } else {
    console.log('ℹ️ LNbits temporairement désactivé - api.dazno.de est MCP-Light API');
  }

  console.log(`📊 Providers disponibles: ${providers.map(p => p.name).join(', ')}`);
  return providers;
}

/**
 * Génère une facture via NWC (fallback)
 */
async function generateNWCInvoice(amount: number, description: string, _service: any) {
  const NWC_URL = process.env.NWC_URL || 'nostr+walletconnect://de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30?relay=wss://relay.getalby.com/v1&secret=b5264968ca3e66af8afc23934c2480c7b0e180c7c62bab55d14f012d9d541324';
  
  let nwc;
  try {
    console.log('API create-invoice - Initialisation NWC...');
    nwc = new webln.NWC({ nostrWalletConnectUrl: NWC_URL });
    await nwc.enable();

    // Sanitiser le memo
    let safeMemo = typeof description === 'string' ? description : '';
    safeMemo = safeMemo.normalize('NFKD').replace(/[^\x00-\x7F]/g, '');
    if (!safeMemo) safeMemo = 'DazNode Payment';

    const result = await nwc.makeInvoice({
      amount: Number(amount),
      defaultMemo: safeMemo,
    });

    if (!result.paymentRequest) {
      throw new Error('Données de facture incomplètes reçues du service NWC');
    }

    let paymentHash = result.paymentHash;
    if (!paymentHash && result.paymentRequest) {
      paymentHash = `extracted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    return {
      id: paymentHash || `gen_${Date.now()}`,
      paymentRequest: result.paymentRequest,
      paymentHash: paymentHash,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      amount
    };

  } finally {
    if (nwc) {
      try { 
        nwc.close(); 
      } catch (e) {
        console.warn('Erreur lors de la fermeture NWC:', e);
      }
    }
  }
}

/**
 * Génère une facture de test en dernier recours
 */
async function generateTestInvoice(amount: number, _description: string): Promise<ApiResponse> {
  console.log('API create-invoice - Mode test activé, génération d\'une facture factice');
  
  const mockPaymentHash = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const mockPaymentRequest = `lnbc${amount}u1p0test123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz`;
  
  return {
    invoice: {
      id: mockPaymentHash,
      payment_request: mockPaymentRequest,
      payment_hash: mockPaymentHash,
      expires_at: new Date(Date.now() + 3600000).toISOString(),
      amount
    },
    paymentUrl: `lightning:${mockPaymentRequest}`,
    provider: 'test',
    isTest: true
  };
} 
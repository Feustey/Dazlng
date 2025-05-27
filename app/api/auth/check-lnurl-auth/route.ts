import { NextRequest, NextResponse } from 'next/server';

// Ce sera synchronisé avec l'autre endpoint (en production utiliser Redis)
declare global {
  // eslint-disable-next-line no-var
  var authChallenges: Map<string, { 
    timestamp: number; 
    k1: string; 
    pubkey?: string; 
    authenticated?: boolean 
  }> | undefined;
}

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get('challenge');
  
  if (!challenge) {
    return NextResponse.json({ authenticated: false, error: 'Challenge manquant' }, { status: 400 });
  }

  // Accéder au même Map que l'autre endpoint
  if (!global.authChallenges) {
    return NextResponse.json({ authenticated: false, error: 'Challenge non trouvé' });
  }

  const challengeData = global.authChallenges.get(challenge);
  
  if (!challengeData) {
    return NextResponse.json({ authenticated: false, error: 'Challenge expiré ou invalide' });
  }

  if (!challengeData.authenticated) {
    return NextResponse.json({ authenticated: false, waiting: true });
  }

  // L'authentification est terminée, retourner les données
  return NextResponse.json({ 
    authenticated: true,
    pubkey: challengeData.pubkey 
  });
} 
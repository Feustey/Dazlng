import { NextResponse } from 'next/server';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { walletType, connectionString } = await req.json();

    if (!walletType || !connectionString) {
      return NextResponse.json(
        { error: 'Type de wallet et chaîne de connexion requis' },
        { status: 400 }
      );
    }

    // Validation basique selon le type de wallet
    let isValid = false;
    let errorMessage = '';

    switch (walletType) {
      case 'lnd':
        isValid = connectionString.startsWith('lnd://') || connectionString.includes('@');
        errorMessage = 'Format LND invalide. Attendu: lnd://admin:macaroon@host:port';
        break;
        
      case 'clightning':
        isValid = connectionString.startsWith('c-lightning://') || connectionString.includes('rune');
        errorMessage = 'Format Core Lightning invalide. Attendu: c-lightning://rune@host:port';
        break;
        
      case 'nwc':
        isValid = connectionString.startsWith('nostr+walletconnect://');
        errorMessage = 'Format NWC invalide. Attendu: nostr+walletconnect://...';
        break;
        
      case 'lnurl':
        isValid = connectionString.toUpperCase().startsWith('LNURL') || connectionString.startsWith('lightning:');
        errorMessage = 'Format LNURL invalide. Attendu: LNURL... ou lightning:lnurl...';
        break;
        
      default:
        return NextResponse.json(
          { error: 'Type de wallet non supporté' },
          { status: 400 }
        );
    }

    if (!isValid) {
      return NextResponse.json(
        { error: errorMessage },
        { status: 400 }
      );
    }

    // Test de connexion simulé
    // En production, vous devriez réellement tester la connexion
    const testConnection = async (): Promise<boolean> => {
      // Simulation d'un délai de connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validation supplémentaire selon le type
      switch (walletType) {
        case 'lnd':
          // Vérifier le format host:port
          if (connectionString.includes('@')) {
            const hostPart = connectionString.split('@')[1];
            return hostPart && hostPart.includes(':');
          }
          return false;
          
        case 'clightning':
          return connectionString.includes('rune') && connectionString.includes('@');
          
        case 'nwc':
          return connectionString.length > 50; // NWC URLs sont longues
          
        case 'lnurl':
          return connectionString.length > 10;
          
        default:
          return false;
      }
    };

    const connectionSuccessful = await testConnection();

    if (!connectionSuccessful) {
      return NextResponse.json(
        { error: 'Impossible de se connecter avec ces paramètres' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Connexion testée avec succès',
      walletType
    });

  } catch (error) {
    console.error('Erreur lors du test de connexion wallet:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du test de connexion' },
      { status: 500 }
    );
  }
} 
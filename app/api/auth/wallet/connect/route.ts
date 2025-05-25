import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Interfaces pour le typage des wallets
interface LndWalletInfo {
  type: 'lnd';
  host: string;
  port: number;
  credentials: string;
}

interface CLightningWalletInfo {
  type: 'clightning';
  host: string;
  port: number;
  rune: string;
}

interface NWCWalletInfo {
  type: 'nwc';
  connectionString: string;
}

interface LnurlWalletInfo {
  type: 'lnurl';
  lnurl: string;
}

type WalletInfo = LndWalletInfo | CLightningWalletInfo | NWCWalletInfo | LnurlWalletInfo | Record<string, never>;

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { walletType, connectionString } = await req.json();

    if (!walletType || !connectionString) {
      return NextResponse.json(
        { error: 'Type de wallet et chaîne de connexion requis' },
        { status: 400 }
      );
    }

    // Validation et extraction des informations selon le type de wallet
    let walletInfo: WalletInfo = {};
    let isValid = false;

    switch (walletType) {
      case 'lnd':
        if (connectionString.includes('@')) {
          const [credentials, hostPort] = connectionString.split('@');
          const [host, port] = hostPort.split(':');
          if (host && port) {
            walletInfo = {
              type: 'lnd',
              host,
              port: parseInt(port),
              credentials: credentials.replace('lnd://', '')
            };
            isValid = true;
          }
        }
        break;
        
      case 'clightning':
        if (connectionString.includes('@') && connectionString.includes('rune')) {
          const [credentials, hostPort] = connectionString.split('@');
          const [host, port] = hostPort.split(':');
          if (host && port) {
            walletInfo = {
              type: 'clightning',
              host,
              port: parseInt(port),
              rune: credentials.replace('c-lightning://', '')
            };
            isValid = true;
          }
        }
        break;
        
      case 'nwc':
        if (connectionString.startsWith('nostr+walletconnect://')) {
          walletInfo = {
            type: 'nwc',
            connectionString: connectionString
          };
          isValid = true;
        }
        break;
        
      case 'lnurl':
        if (connectionString.toUpperCase().startsWith('LNURL') || connectionString.startsWith('lightning:')) {
          walletInfo = {
            type: 'lnurl',
            lnurl: connectionString
          };
          isValid = true;
        }
        break;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: 'Format de connexion invalide pour ce type de wallet' },
        { status: 400 }
      );
    }

    // Simulation de connexion et récupération d'informations du wallet
    const connectToWallet = async (): Promise<{ success: boolean; nodeId?: string; alias?: string }> => {
      // Simulation d'un délai de connexion
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // En production, ici vous devriez :
      // 1. Établir une vraie connexion au wallet/node
      // 2. Vérifier les permissions
      // 3. Récupérer les informations du node (ID, alias, etc.)
      
      // Simulation de récupération d'informations
      const nodeId = crypto.randomBytes(33).toString('hex');
      const aliases = ['DazNode', 'LightningPro', 'BitcoinNode', 'ThunderHub'];
      const alias = aliases[Math.floor(Math.random() * aliases.length)];
      
      return {
        success: true,
        nodeId,
        alias
      };
    };

    const connectionResult = await connectToWallet();

    if (!connectionResult.success) {
      return NextResponse.json(
        { error: 'Échec de la connexion au wallet' },
        { status: 400 }
      );
    }

    // Créer un identifiant unique pour cet utilisateur basé sur les informations du wallet
    const userId = crypto
      .createHash('sha256')
      .update(JSON.stringify(walletInfo) + (connectionResult.nodeId || ''))
      .digest('hex');

    // Créer l'objet utilisateur
    const user = {
      id: userId,
      walletType,
      nodeId: connectionResult.nodeId,
      alias: connectionResult.alias,
      loginMethod: 'wallet',
      lastLogin: new Date().toISOString()
    };

    // Générer un JWT
    const token = jwt.sign(
      { 
        userId: user.id,
        walletType,
        nodeId: connectionResult.nodeId,
        loginMethod: 'wallet',
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 jours
      },
      JWT_SECRET
    );

    // En production, sauvegarder les informations de connexion chiffrées en base
    // Ne jamais stocker les clés privées ou macaroons en plain text

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        walletType: user.walletType,
        nodeId: user.nodeId,
        alias: user.alias,
        loginMethod: user.loginMethod
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion wallet:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la connexion' },
      { status: 500 }
    );
  }
} 
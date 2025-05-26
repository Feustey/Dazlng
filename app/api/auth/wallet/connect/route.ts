import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Interfaces pour le typage des wallets
interface NWCWalletInfo {
  type: 'nwc';
  connectionString: string;
}

interface AlgorandWalletInfo {
  type: 'algorand';
  address: string;
}

interface LnurlWalletInfo {
  type: 'lnurl';
  lnurl: string;
}

type WalletInfo = NWCWalletInfo | AlgorandWalletInfo | LnurlWalletInfo | Record<string, never>;

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
      case 'nwc':
        if (connectionString.startsWith('nostr+walletconnect://')) {
          walletInfo = {
            type: 'nwc',
            connectionString: connectionString
          };
          isValid = true;
        }
        break;
      case 'algorand':
        if (typeof connectionString === 'string' && connectionString.length === 58) {
          walletInfo = {
            type: 'algorand',
            address: connectionString
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
    const connectToWallet = async (): Promise<{ success: boolean; nodeId?: string; alias?: string; address?: string }> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      if (walletType === 'algorand') {
        return {
          success: true,
          address: connectionString,
          alias: 'Algorand Wallet'
        };
      } else {
        const nodeId = crypto.randomBytes(33).toString('hex');
        const aliases = ['DazNode', 'LightningPro', 'BitcoinNode', 'ThunderHub'];
        const alias = aliases[Math.floor(Math.random() * aliases.length)];
        return {
          success: true,
          nodeId,
          alias
        };
      }
    };

    const connectionResult = await connectToWallet();

    if (!connectionResult.success) {
      return NextResponse.json(
        { error: 'Échec de la connexion au wallet' },
        { status: 400 }
      );
    }

    const userId = crypto
      .createHash('sha256')
      .update(JSON.stringify(walletInfo) + (connectionResult.nodeId || connectionResult.address || ''))
      .digest('hex');

    const user = {
      id: userId,
      walletType,
      nodeId: connectionResult.nodeId,
      address: connectionResult.address,
      alias: connectionResult.alias,
      loginMethod: 'wallet',
      lastLogin: new Date().toISOString()
    };

    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

    return NextResponse.json({
      success: true,
      message: 'Connexion wallet réussie',
      token,
      user: {
        id: user.id,
        walletType: user.walletType,
        alias: user.alias,
        nodeId: user.nodeId,
        address: user.address
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
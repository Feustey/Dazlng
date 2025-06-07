import { NextRequest, NextResponse } from 'next/server';

interface Channel {
  id: string;
  remotePubkey: string;
  remoteAlias?: string;
  capacity: number;
  localBalance: number;
  remoteBalance: number;
  status: 'active' | 'inactive' | 'pending' | 'closing';
  isPrivate: boolean;
  channelPoint: string;
  feeRatePerKw: number;
  baseFee: number;
  feeRate: number;
  timelock: number;
  minHtlc: number;
  maxHtlc: number;
  lastUpdate: string;
  uptime: number;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    pagination?: {
      total: number;
      page: number;
      limit: number;
    };
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ nodeId: string }> }
): Promise<Response> {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const sort = searchParams.get('sort') || 'capacity:desc';
    
    const resolvedParams = await params;
    const nodeId = resolvedParams.nodeId;
    
    // Validation de la pubkey
    if (!/^[0-9a-fA-F]{66}$/.test(nodeId)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_NODE_ID',
          message: 'ID de nœud invalide'
        }
      }, { status: 400 });
    }

    // Simulation des données - à remplacer par l'API Lightning réelle
    const mockChannels: Channel[] = Array.from({ length: 15 }, (_, i) => ({
      id: `channel_${i + 1}`,
      remotePubkey: `03${Math.random().toString(16).substring(2, 66).padEnd(64, '0')}`,
      remoteAlias: `Node-${i + 1}`,
      capacity: Math.floor(Math.random() * 10000000) + 1000000,
      localBalance: Math.floor(Math.random() * 5000000),
      remoteBalance: Math.floor(Math.random() * 5000000),
      status: ['active', 'inactive', 'pending'][Math.floor(Math.random() * 3)] as Channel['status'],
      isPrivate: Math.random() > 0.7,
      channelPoint: `${Math.random().toString(16).substring(2, 66)}:${i}`,
      feeRatePerKw: Math.floor(Math.random() * 1000) + 100,
      baseFee: Math.floor(Math.random() * 10),
      feeRate: Math.floor(Math.random() * 500) + 50,
      timelock: 144,
      minHtlc: 1000,
      maxHtlc: Math.floor(Math.random() * 1000000) + 100000,
      lastUpdate: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      uptime: Math.floor(Math.random() * 100)
    }));

    // Filtrage par statut
    let filteredChannels = mockChannels;
    if (status) {
      filteredChannels = mockChannels.filter(channel => channel.status === status);
    }

    // Tri
    const [sortField, sortOrder] = sort.split(':');
    filteredChannels.sort((a, b) => {
      const aVal = a[sortField as keyof Channel];
      const bVal = b[sortField as keyof Channel];
      
      if (aVal === undefined || bVal === undefined) return 0;
      
      let compareA = aVal;
      let compareB = bVal;
      
      if (typeof compareA === 'string') compareA = compareA.toLowerCase();
      if (typeof compareB === 'string') compareB = compareB.toLowerCase();
      
      if (sortOrder === 'desc') {
        return compareA > compareB ? -1 : 1;
      }
      return compareA < compareB ? -1 : 1;
    });

    // Pagination
    const total = filteredChannels.length;
    const startIndex = (page - 1) * limit;
    const paginatedChannels = filteredChannels.slice(startIndex, startIndex + limit);

    return NextResponse.json<ApiResponse<Channel[]>>({
      success: true,
      data: paginatedChannels,
      meta: {
        pagination: {
          total,
          page,
          limit
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des canaux:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur interne du serveur'
      }
    }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params: _params }: { params: Promise<{ nodeId: string }> }
): Promise<Response> {
  try {
    const body = await req.json();
    const { remotePubkey, amount, pushAmount = 0, isPrivate = false } = body;

    // Validation des paramètres
    if (!remotePubkey || !amount) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'MISSING_PARAMETERS',
          message: 'Paramètres manquants: remotePubkey et amount sont requis'
        }
      }, { status: 400 });
    }

    if (!/^[0-9a-fA-F]{66}$/.test(remotePubkey)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_PUBKEY',
          message: 'Clé publique distante invalide'
        }
      }, { status: 400 });
    }

    if (amount < 20000 || amount > 16777215) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_AMOUNT',
          message: 'Montant invalide (min: 20,000 sats, max: 16,777,215 sats)'
        }
      }, { status: 400 });
    }

    // Simulation de l'ouverture de canal
    const newChannel: Partial<Channel> = {
      id: `pending_${Date.now()}`,
      remotePubkey,
      capacity: amount,
      localBalance: amount - pushAmount,
      remoteBalance: pushAmount,
      status: 'pending',
      isPrivate,
      lastUpdate: new Date().toISOString()
    };

    return NextResponse.json<ApiResponse<Partial<Channel>>>({
      success: true,
      data: newChannel
    });

  } catch (error) {
    console.error('Erreur lors de l\'ouverture du canal:', error);
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur interne du serveur'
      }
    }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import mcpService from '@/lib/mcpService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pubkey = searchParams.get('pubkey');

    if (pubkey) {
      const peersOfPeers = await mcpService.getPeersOfPeers(pubkey);
      return NextResponse.json(peersOfPeers);
    }

    // Si pas de pubkey, retourner une erreur car le service MCP nécessite une pubkey
    return NextResponse.json(
      { error: 'La pubkey du nœud est requise' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 
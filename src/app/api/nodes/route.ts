import { NextResponse } from 'next/server';
import sparkseerService from '@/lib/sparkseerService';
import { getPeersOfPeers } from '@/lib/nodes';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pubkey = searchParams.get('pubkey');

    if (pubkey) {
      const peersOfPeers = await getPeersOfPeers(pubkey);
      return NextResponse.json(peersOfPeers);
    }

    const data = await sparkseerService.getAllNodes();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Sparkseer data:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
} 
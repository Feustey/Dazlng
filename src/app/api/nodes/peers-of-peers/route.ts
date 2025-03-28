import { NextResponse } from 'next/server';
import sparkseerService from '@/lib/sparkseerService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pubkey = searchParams.get('pubkey');

    if (!pubkey) {
      return NextResponse.json(
        { error: 'La pubkey du nœud est requise' },
        { status: 400 }
      );
    }

    const peersOfPeers = await sparkseerService.getPeersOfPeers(pubkey);
    return NextResponse.json(peersOfPeers);
  } catch (error) {
    console.error('Error fetching peers of peers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch peers of peers' },
      { status: 500 }
    );
  }
} 
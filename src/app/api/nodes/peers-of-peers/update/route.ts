import { NextResponse } from 'next/server';
import sparkseerService from '@/lib/sparkseerService';

export async function POST(request: Request) {
  try {
    const { pubkey } = await request.json();
    
    if (!pubkey) {
      return NextResponse.json(
        { error: 'La pubkey du nœud est requise' },
        { status: 400 }
      );
    }

    const peersOfPeers = await sparkseerService.fetchAndStorePeersOfPeers(pubkey);
    return NextResponse.json(peersOfPeers);
  } catch (error) {
    console.error('Error updating peers of peers:', error);
    return NextResponse.json(
      { error: 'Failed to update peers of peers' },
      { status: 500 }
    );
  }
} 
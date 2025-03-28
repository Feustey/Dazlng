import { NextResponse } from 'next/server';
import mcpService from '@/lib/mcpService';

export async function GET(
  request: Request,
  { params }: { params: { pubkey: string } }
) {
  try {
    const peersOfPeers = await mcpService.getPeersOfPeers(params.pubkey);
    return NextResponse.json(peersOfPeers);
  } catch (error) {
    console.error('Erreur lors de la récupération des pairs des pairs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des pairs des pairs' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { pubkey: string } }
) {
  try {
    const peersOfPeers = await mcpService.getPeersOfPeers(params.pubkey);
    return NextResponse.json(peersOfPeers);
  } catch (error) {
    console.error('Error updating peers of peers:', error);
    return NextResponse.json(
      { error: 'Failed to update peers of peers' },
      { status: 500 }
    );
  }
} 
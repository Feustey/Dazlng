import { NextResponse } from 'next/server';
import { fetchAndStoreNodeData, getNodeData, getAllNodes } from '@/lib/sparkseerService';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pubkey = searchParams.get('pubkey');

    if (pubkey) {
      const nodeData = await getNodeData(pubkey);
      return NextResponse.json(nodeData);
    } else {
      const nodes = await getAllNodes();
      return NextResponse.json(nodes);
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pubkey } = body;

    if (!pubkey) {
      return NextResponse.json(
        { error: 'Pubkey est requis' },
        { status: 400 }
      );
    }

    const nodeData = await fetchAndStoreNodeData(pubkey);
    return NextResponse.json(nodeData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des données' },
      { status: 500 }
    );
  }
} 
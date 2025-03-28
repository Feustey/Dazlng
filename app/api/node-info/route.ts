import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pubkey = searchParams.get('pubkey');

    if (!pubkey) {
      return NextResponse.json(
        { error: 'Le pubkey est requis' },
        { status: 400 }
      );
    }

    const response = await fetch(`https://1ml.com/node/${pubkey}/json`);
    
    if (!response.ok) {
      throw new Error('Échec de la récupération des informations du nœud');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des informations du nœud:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des informations du nœud' },
      { status: 500 }
    );
  }
} 
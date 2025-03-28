import { NextResponse } from 'next/server';
import mcpService from '@/lib/mcpService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pubkey } = body;

    if (!pubkey) {
      return NextResponse.json(
        { error: 'La pubkey du nœud est requise' },
        { status: 400 }
      );
    }

    const optimizationResult = await mcpService.optimizeNode(pubkey);
    return NextResponse.json(optimizationResult);
  } catch (error) {
    console.error('Erreur lors de l\'optimisation du nœud:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'optimisation du nœud' },
      { status: 500 }
    );
  }
} 
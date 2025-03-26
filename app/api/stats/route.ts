import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Node from '@/models/Node';

const PUBKEY = "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";

export async function GET() {
  try {
    await connectToDatabase();
    
    // Récupérer les données actuelles
    const currentStats = await Node.findOne({ pubkey: PUBKEY })
      .sort({ timestamp: -1 })
      .limit(1);

    if (!currentStats) {
      return NextResponse.json(
        { error: 'Aucune donnée trouvée' },
        { status: 404 }
      );
    }

    // Récupérer les données historiques (dernières 24 heures)
    const historicalData = await Node.find({ pubkey: PUBKEY })
      .sort({ timestamp: -1 })
      .limit(24);

    return NextResponse.json({
      current: currentStats,
      historical: historicalData
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
} 
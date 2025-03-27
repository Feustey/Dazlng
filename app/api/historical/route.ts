import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Node from '@/models/Node';

const PUBKEY = "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";

export async function GET() {
  try {
    await connectToDatabase();

    // Récupérer les données historiques (dernières 30 jours)
    const historicalData = await Node.find({ pubkey: PUBKEY })
      .sort({ timestamp: -1 })
      .limit(30);

    // Formater les données pour correspondre à l'interface HistoricalData
    const formattedData = historicalData.map(record => ({
      timestamp: record.timestamp.toISOString(),
      total_fees: record.total_fees,
      total_capacity: record.total_capacity,
      active_channels: record.active_channel_count,
      total_peers: record.total_peers,
      total_volume: record.total_volume
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données historiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données historiques' },
      { status: 500 }
    );
  }
} 
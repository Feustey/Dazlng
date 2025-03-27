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

    // Formater les données pour correspondre à l'interface NodeStats
    const formattedStats = {
      pubkey: currentStats.pubkey,
      alias: currentStats.alias,
      platform: currentStats.platform,
      version: currentStats.version,
      total_fees: currentStats.total_fees,
      avg_fee_rate_ppm: currentStats.avg_fee_rate_ppm,
      total_capacity: currentStats.total_capacity,
      active_channel_count: currentStats.active_channel_count,
      total_volume: currentStats.total_volume,
      total_peers: currentStats.total_peers,
      uptime: currentStats.uptime,
      opened_channel_count: currentStats.opened_channel_count,
      color: currentStats.color,
      address: currentStats.address,
      closed_channel_count: currentStats.closed_channel_count,
      pending_channel_count: currentStats.pending_channel_count,
      avg_capacity: currentStats.avg_capacity,
      avg_fee_rate: currentStats.avg_fee_rate,
      avg_base_fee_rate: currentStats.avg_base_fee_rate,
      last_update: currentStats.timestamp.toISOString()
    };

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données' },
      { status: 500 }
    );
  }
} 
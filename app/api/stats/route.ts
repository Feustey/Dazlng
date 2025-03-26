import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import Node from '@/models/Node';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Récupérer le dernier nœud enregistré
    const latestNode = await Node.findOne()
      .sort({ timestamp: -1 })
      .limit(1);

    if (!latestNode) {
      return NextResponse.json(
        { error: 'Aucune donnée disponible' },
        { status: 404 }
      );
    }

    // Transformer les données pour correspondre au format attendu par le frontend
    const stats = {
      alias: latestNode.alias,
      pubkey: latestNode.pubkey,
      platform: latestNode.platform,
      version: latestNode.version,
      total_fees: latestNode.total_fees,
      avg_fee_rate_ppm: latestNode.avg_fee_rate_ppm,
      total_capacity: latestNode.total_capacity,
      active_channel_count: latestNode.active_channel_count,
      total_volume: latestNode.total_volume,
      total_peers: latestNode.total_peers,
      uptime: latestNode.uptime,
      opened_channel_count: latestNode.opened_channel_count,
      last_update: latestNode.timestamp
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
} 
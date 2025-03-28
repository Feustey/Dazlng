import { NextResponse } from 'next/server';
import mcpService from '@/lib/mcpService';

export async function GET() {
  try {
    // Récupérer les données actuelles via l'API MCP
    const currentStats = await mcpService.getCurrentStats();

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
      active_channel_count: currentStats.active_channels,
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
      last_update: currentStats.timestamp
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
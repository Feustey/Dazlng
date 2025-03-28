import { NextResponse } from 'next/server';
import mcpService from '@/lib/mcpService';

export async function GET() {
  try {
    const [currentData, historicalData] = await Promise.all([
      mcpService.getCurrentStats(),
      mcpService.getHistoricalData(),
    ]);

    if (!currentData) {
      return NextResponse.json(
        { error: 'Aucune donnée actuelle trouvée' },
        { status: 404 }
      );
    }
    
    // Format the data for better readability
    const formattedData = {
      nodeInfo: {
        pubkey: currentData.pubkey,
        alias: currentData.alias,
        color: currentData.color,
        platform: currentData.platform,
        version: currentData.version,
        address: currentData.address,
      },
      channelStats: {
        opened: currentData.opened_channel_count || 0,
        active: currentData.active_channels || 0,
        closed: currentData.closed_channel_count || 0,
        pending: currentData.pending_channel_count || 0,
      },
      financialMetrics: {
        totalCapacity: currentData.total_capacity || 0,
        averageCapacity: currentData.avg_capacity || 0,
        totalVolume: currentData.total_volume || 0,
        totalFees: currentData.total_fees || 0,
      },
      feeRates: {
        average: currentData.avg_fee_rate || 0,
        baseRate: currentData.avg_base_fee_rate || 0,
        ppm: currentData.avg_fee_rate_ppm || 0,
      },
      networkMetrics: {
        totalPeers: currentData.total_peers || 0,
        uptime: currentData.uptime || 0,
        lastUpdate: currentData.timestamp || new Date().toISOString(),
      },
      historical: historicalData.map(item => ({
        timestamp: item.timestamp,
        totalCapacity: item.total_capacity || 0,
        activeChannels: item.active_channels || 0,
        totalVolume: item.total_volume || 0,
        totalFees: item.total_fees || 0,
        totalPeers: item.total_peers || 0,
      })),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des données du nœud' },
      { status: 500 }
    );
  }
}
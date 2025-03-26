import { getCurrentStats, getHistoricalData } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [currentData, historicalData] = await Promise.all([
      getCurrentStats(),
      getHistoricalData(),
    ]);
    
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
        opened: currentData.opened_channel_count,
        active: currentData.active_channel_count,
        closed: currentData.closed_channel_count,
        pending: currentData.pending_channel_count,
      },
      financialMetrics: {
        totalCapacity: currentData.total_capacity,
        averageCapacity: currentData.avg_capacity,
        totalVolume: currentData.total_volume,
        totalFees: currentData.total_fees,
      },
      feeRates: {
        average: currentData.avg_fee_rate,
        baseRate: currentData.avg_base_fee_rate,
        ppm: currentData.avg_fee_rate_ppm,
      },
      networkMetrics: {
        totalPeers: currentData.total_peers,
        uptime: currentData.uptime,
        lastUpdate: currentData.last_update,
      },
      historical: historicalData.map(item => ({
        timestamp: item.timestamp,
        totalCapacity: item.total_capacity,
        activeChannels: item.active_channels,
        totalVolume: item.total_volume,
        totalFees: item.total_fees,
        totalPeers: item.total_peers,
      })),
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch node stats' },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import mcpService from "@/lib/mcpService";

// Type pour les données historiques
interface HistoricalDataItem {
  timestamp: string;
  total_capacity?: number;
  active_channels?: number;
  total_volume?: number;
  total_fees?: number;
  total_peers?: number;
}

export async function GET() {
  try {
    // Données de test à utiliser en cas d'indisponibilité de l'API externe
    const mockData = {
      nodeInfo: {
        pubkey:
          "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b",
        alias: "DAZLNG-NODE",
        color: "#3399ff",
        platform: "linux-amd64",
        version: "LND 0.16.4",
        address: "107.189.30.195:9735",
      },
      channelStats: {
        opened: 12,
        active: 10,
        closed: 2,
        pending: 0,
      },
      financialMetrics: {
        totalCapacity: 5000000,
        averageCapacity: 500000,
        totalVolume: 1200000,
        totalFees: 5000,
      },
      feeRates: {
        average: 0.00025,
        baseRate: 1000,
        ppm: 250,
      },
      networkMetrics: {
        totalPeers: 8,
        uptime: 99.8,
        lastUpdate: new Date().toISOString(),
      },
      historical: Array.from({ length: 7 }, (_, i) => ({
        timestamp: new Date(Date.now() - i * 86400000).toISOString(),
        totalCapacity: 5000000 - i * 100000,
        activeChannels: 10 - (i > 5 ? 1 : 0),
        totalVolume: 1200000 - i * 50000,
        totalFees: 5000 - i * 200,
        totalPeers: 8 - (i > 3 ? 1 : 0),
      })),
    };

    try {
      // Essayer d'obtenir les données réelles
      const [currentData, historicalData] = await Promise.all([
        mcpService.getCurrentStats(),
        mcpService.getHistoricalData(),
      ]);

      if (!currentData) {
        console.warn(
          "Données actuelles non disponibles, utilisation des données fictives"
        );
        return NextResponse.json(mockData);
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
        historical: historicalData.map((item: HistoricalDataItem) => ({
          timestamp: item.timestamp,
          totalCapacity: item.total_capacity || 0,
          activeChannels: item.active_channels || 0,
          totalVolume: item.total_volume || 0,
          totalFees: item.total_fees || 0,
          totalPeers: item.total_peers || 0,
        })),
      };

      return NextResponse.json(formattedData);
    } catch (apiError) {
      console.warn(
        "Erreur API externe, utilisation des données fictives:",
        apiError
      );
      return NextResponse.json(mockData);
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des données:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des données du nœud" },
      { status: 500 }
    );
  }
}

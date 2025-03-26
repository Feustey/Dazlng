import { connectToDatabase } from '../lib/mongodb';
import { Node } from '../models/Node';

const PUBKEY = "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";
const API_URL = "https://api.sparkseer.space/v1";

async function fetchHistoricalData() {
  const response = await fetch(`${API_URL}/node/historical/${PUBKEY}`, {
    headers: {
      'Authorization': `Bearer ${process.env.SPARKSEER_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch historical data');
  }

  return response.json();
}

async function importHistoricalData() {
  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    const historicalData = await fetchHistoricalData();
    console.log(`Fetched ${historicalData.length} historical records`);

    // Transformer et sauvegarder chaque enregistrement
    for (const record of historicalData) {
      const nodeData = {
        alias: record.alias,
        pubkey: record.pubkey,
        platform: record.platform,
        version: record.version,
        total_fees: record.total_fees,
        avg_fee_rate_ppm: record.avg_fee_rate_ppm,
        total_capacity: record.total_capacity,
        active_channel_count: record.active_channel_count,
        total_volume: record.total_volume,
        total_peers: record.total_peers,
        uptime: record.uptime,
        opened_channel_count: record.opened_channel_count,
        timestamp: new Date(record.timestamp)
      };

      // Utiliser upsert pour éviter les doublons
      await Node.findOneAndUpdate(
        { pubkey: nodeData.pubkey, timestamp: nodeData.timestamp },
        nodeData,
        { upsert: true }
      );
    }

    console.log('Historical data import completed successfully');
  } catch (error) {
    console.error('Error importing historical data:', error);
    process.exit(1);
  }
}

// Exécuter l'importation
importHistoricalData(); 
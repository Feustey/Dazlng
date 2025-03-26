import 'dotenv/config';
import connectToDatabase from '../lib/mongodb';
import Node from '../models/Node';

const PUBKEY = "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";
const API_URL = "https://api.sparkseer.space/v1";

async function fetchHistoricalData() {
  try {
    const apiKey = process.env.SPARKSEER_API_KEY;
    console.log('API URL:', `${API_URL}/node/historical/${PUBKEY}`);
    console.log('API Key length:', apiKey?.length);
    console.log('API Key first 10 chars:', apiKey?.substring(0, 10));
    
    const response = await fetch(`${API_URL}/node/historical/${PUBKEY}`, {
      headers: {
        'api-key': apiKey || '',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: errorText
      });
      throw new Error(`Failed to fetch historical data: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Structure de la réponse API:', {
      type: typeof data,
      isArray: Array.isArray(data),
      keys: Object.keys(data),
      historicalStatsLength: data.historical_stats?.length
    });

    if (!data.historical_stats || !Array.isArray(data.historical_stats)) {
      throw new Error('La réponse API ne contient pas de données historiques valides');
    }

    return data.historical_stats;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
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
        alias: record.alias || 'Unknown',
        pubkey: PUBKEY,
        platform: record.platform || 'Unknown',
        version: record.version || 'Unknown',
        total_fees: record.total_fees || 0,
        avg_fee_rate_ppm: record.avg_fee_rate_ppm || 0,
        total_capacity: record.total_capacity || 0,
        active_channel_count: record.num_channels || 0,
        total_volume: record.total_volume || 0,
        total_peers: record.total_peers || 0,
        uptime: record.uptime || 0,
        opened_channel_count: record.opened_channel_count || 0,
        color: record.color || '#000000',
        address: record.address || 'Unknown',
        closed_channel_count: record.closed_channel_count || 0,
        pending_channel_count: record.pending_channel_count || 0,
        avg_capacity: record.mean_channel_capacity || 0,
        avg_fee_rate: record.mean_outbound_fee_rate || 0,
        avg_base_fee_rate: record.mean_outbound_base_fee || 0,
        betweenness_rank: record.betweenness_rank || 0,
        eigenvector_rank: record.eigenvector_rank || 0,
        closeness_rank: record.closeness_rank || 0,
        weighted_betweenness_rank: record.weighted_betweenness_rank || 0,
        weighted_closeness_rank: record.weighted_closeness_rank || 0,
        weighted_eigenvector_rank: record.weighted_eigenvector_rank || 0,
        timestamp: new Date(record.date)
      };

      try {
        // Utiliser upsert pour éviter les doublons
        const result = await Node.findOneAndUpdate(
          { pubkey: nodeData.pubkey, timestamp: nodeData.timestamp },
          nodeData,
          { upsert: true, new: true }
        );
        console.log(`Imported/Updated node for date: ${nodeData.timestamp}`);
      } catch (error) {
        console.error(`Error importing node for date ${nodeData.timestamp}:`, error);
      }
    }

    console.log('Historical data import completed successfully');
  } catch (error) {
    console.error('Error importing historical data:', error);
    process.exit(1);
  }
}

// Exécuter l'importation
importHistoricalData(); 
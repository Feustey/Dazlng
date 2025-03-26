import { Handler } from '@netlify/functions';
import { connectToDatabase } from '../../lib/mongodb';
import { Node } from '../../models/Node';

const PUBKEY = "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b";
const API_URL = "https://api.sparkseer.space/v1";

async function fetchCurrentStats() {
  const response = await fetch(`${API_URL}/node/current-stats/${PUBKEY}`, {
    headers: {
      'Authorization': `Bearer ${process.env.SPARKSEER_API_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch current stats');
  }

  return response.json();
}

const handler: Handler = async (event) => {
  // Vérifier le secret pour la sécurité
  if (event.headers['x-webhook-secret'] !== process.env.WEBHOOK_SECRET) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
    };
  }

  try {
    await connectToDatabase();
    console.log('Connected to MongoDB');

    const currentStats = await fetchCurrentStats();
    console.log('Fetched current stats');

    const nodeData = {
      alias: currentStats.alias,
      pubkey: currentStats.pubkey,
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
      timestamp: new Date()
    };

    await Node.create(nodeData);
    console.log('Daily data update completed successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Data updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update data' }),
    };
  }
};

export { handler }; 
import { useNode } from '@/contexts/NodeContext';

const MCP_API_URL = process.env.NEXT_PUBLIC_MCP_API_URL || 'https://your-mcp-api-url';

export interface SparkseerData {
  nodeId: string;
  timestamp: string;
  metrics: {
    capacity: number;
    channels: number;
    avgChannelSize: number;
    avgFeeRate: number;
    // Ajoutez d'autres métriques selon vos besoins
  };
}

export const fetchSparkseerData = async (nodeId: string): Promise<SparkseerData[]> => {
  try {
    const response = await fetch(`${MCP_API_URL}/sparkseer/${nodeId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données Sparkseer:', error);
    throw error;
  }
};

export const fetchAllSparkseerData = async (): Promise<SparkseerData[]> => {
  try {
    const response = await fetch(`${MCP_API_URL}/sparkseer`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de toutes les données Sparkseer:', error);
    throw error;
  }
};

export const fetchAndStoreNodeData = async (nodeId: string): Promise<void> => {
  try {
    const data = await fetchSparkseerData(nodeId);
    
    // Stockage des données dans la base de données via l'API
    const response = await fetch('/api/nodes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nodeId,
        data,
      }),
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du stockage des données: ${response.status}`);
    }
  } catch (error) {
    console.error('Erreur lors de la récupération et du stockage des données:', error);
    throw error;
  }
};

export const getNodeData = async (nodeId: string): Promise<SparkseerData[]> => {
  try {
    const response = await fetch(`/api/nodes/${nodeId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du nœud:', error);
    throw error;
  }
};

export const getAllNodes = async (): Promise<SparkseerData[]> => {
  try {
    const response = await fetch('/api/nodes');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les nœuds:', error);
    throw error;
  }
}; 
import connectToDatabase from './mongodb';
import Node, { INode } from '../../models/Node';

const SPARKSEER_API_URL = 'https://api.sparkseer.com/v1';

interface SparkseerChannel {
  channel_id: string;
  capacity: number;
  node1_pubkey: string;
  node2_pubkey: string;
  last_update: string;
  status: string;
}

interface SparkseerNodeData {
  pubkey: string;
  alias: string;
  capacity: number;
  channel_count: number;
  first_seen: string;
  fee_rate: number;
  base_fee: number;
  min_htlc: number;
  max_htlc: number;
  time_lock_delta: number;
  channels: SparkseerChannel[];
}

export async function fetchAndStoreNodeData(pubkey: string): Promise<INode> {
  try {
    await connectToDatabase();
    
    // Appel à l'API Sparkseer
    const response = await fetch(`${SPARKSEER_API_URL}/nodes/${pubkey}`);
    const nodeData: SparkseerNodeData = await response.json();

    // Préparation des données pour MongoDB
    const nodeDocument: INode = {
      pubkey: nodeData.pubkey,
      alias: nodeData.alias,
      platform: 'lightning', // Valeur par défaut
      version: 'unknown', // Valeur par défaut
      total_fees: 0, // À calculer à partir des canaux
      avg_fee_rate_ppm: nodeData.fee_rate,
      total_capacity: nodeData.capacity,
      active_channel_count: nodeData.channel_count,
      total_volume: 0, // À calculer à partir des canaux
      total_peers: nodeData.channels.length,
      uptime: 100, // Valeur par défaut
      opened_channel_count: nodeData.channels.filter(c => c.status === 'active').length,
      color: '#000000', // Valeur par défaut
      address: '', // À remplir si disponible
      closed_channel_count: nodeData.channels.filter(c => c.status === 'closed').length,
      pending_channel_count: nodeData.channels.filter(c => c.status === 'pending').length,
      avg_capacity: nodeData.capacity / nodeData.channel_count,
      avg_fee_rate: nodeData.fee_rate,
      avg_base_fee_rate: nodeData.base_fee,
      betweenness_rank: 0, // À calculer
      eigenvector_rank: 0, // À calculer
      closeness_rank: 0, // À calculer
      weighted_betweenness_rank: 0, // À calculer
      weighted_closeness_rank: 0, // À calculer
      weighted_eigenvector_rank: 0, // À calculer
      timestamp: new Date()
    };

    // Sauvegarde dans MongoDB
    const node = new Node(nodeDocument);
    await node.save();

    return nodeDocument;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du nœud:', error);
    throw error;
  }
}

export async function getNodeData(pubkey: string): Promise<INode | null> {
  try {
    await connectToDatabase();
    const node = await Node.findOne({ pubkey });
    return node;
  } catch (error) {
    console.error('Erreur lors de la récupération des données du nœud:', error);
    throw error;
  }
}

export async function getAllNodes(): Promise<INode[]> {
  try {
    await connectToDatabase();
    const nodes = await Node.find({});
    return nodes;
  } catch (error) {
    console.error('Erreur lors de la récupération de tous les nœuds:', error);
    throw error;
  }
}

export default {
  fetchAndStoreNodeData,
  getNodeData,
  getAllNodes
}; 
import { connectToDatabase } from '../src/lib/mongodb';
import Node, { INode } from '../models/Node';

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
    const nodeDocument = {
      pubkey: nodeData.pubkey,
      alias: nodeData.alias,
      capacity: nodeData.capacity,
      channelCount: nodeData.channel_count,
      firstSeen: new Date(nodeData.first_seen),
      metrics: {
        feeRate: nodeData.fee_rate,
        baseFee: nodeData.base_fee,
        minHtlc: nodeData.min_htlc,
        maxHtlc: nodeData.max_htlc,
        timeLockDelta: nodeData.time_lock_delta,
      },
      channels: nodeData.channels.map((channel) => ({
        channelId: channel.channel_id,
        capacity: channel.capacity,
        node1Pubkey: channel.node1_pubkey,
        node2Pubkey: channel.node2_pubkey,
        lastUpdate: new Date(channel.last_update),
        status: channel.status,
      })),
    };

    // Mise à jour ou création du document
    const result = await Node.findOneAndUpdate(
      { pubkey: nodeData.pubkey },
      nodeDocument,
      { upsert: true, new: true }
    );

    return result;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
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
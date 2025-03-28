import { connectToDatabase } from './mongodb';
import Node, { INode } from '../../models/Node';
import PeerOfPeer, { IPeerOfPeer } from '../../models/PeerOfPeer';

const SPARKSEER_API_URL = '/api/sparkseer/v1';

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

interface SparkseerService {
  fetchAndStoreNodeData: (pubkey: string) => Promise<INode>;
  getNodeData: (pubkey: string) => Promise<INode | null>;
  getAllNodes: () => Promise<INode[]>;
  fetchAndStorePeersOfPeers: (pubkey: string) => Promise<IPeerOfPeer[]>;
  getPeersOfPeers: (pubkey: string) => Promise<IPeerOfPeer[]>;
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
      active_channel_count: nodeData.channels.filter(c => c.status === 'active').length,
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
      timestamp: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
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

export async function fetchAndStorePeersOfPeers(pubkey: string): Promise<IPeerOfPeer[]> {
  try {
    await connectToDatabase();
    
    // Appel à l'API Sparkseer
    const response = await fetch(`https://api.sparkseer.space/v1/node/peers-of-peers/${pubkey}`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Les données reçues ne sont pas un tableau');
    }

    // Supprimer les anciens pairs des pairs pour ce nœud
    await PeerOfPeer.deleteMany({ nodePubkey: pubkey });

    // Sauvegarder les nouveaux pairs des pairs
    const peersOfPeers = await Promise.all(
      data.map(async (peer: any) => {
        const peerOfPeer = new PeerOfPeer({
          nodePubkey: pubkey,
          peerPubkey: peer.pubkey,
          alias: peer.alias,
          platform: peer.platform,
          version: peer.version,
          total_fees: peer.total_fees,
          avg_fee_rate_ppm: peer.avg_fee_rate_ppm,
          total_capacity: peer.total_capacity,
          active_channels: peer.active_channels,
          total_volume: peer.total_volume,
          total_peers: peer.total_peers,
          uptime: peer.uptime,
          opened_channel_count: peer.opened_channel_count,
          color: peer.color,
          address: peer.address,
          closed_channel_count: peer.closed_channel_count,
          pending_channel_count: peer.pending_channel_count,
          avg_capacity: peer.avg_capacity,
          avg_fee_rate: peer.avg_fee_rate,
          avg_base_fee_rate: peer.avg_base_fee_rate,
          betweenness_rank: peer.betweenness_rank,
          eigenvector_rank: peer.eigenvector_rank,
          closeness_rank: peer.closeness_rank,
          weighted_betweenness_rank: peer.weighted_betweenness_rank,
          weighted_closeness_rank: peer.weighted_closeness_rank,
          weighted_eigenvector_rank: peer.weighted_eigenvector_rank,
        });
        return await peerOfPeer.save();
      })
    );

    return peersOfPeers;
  } catch (error) {
    console.error('Erreur lors de la récupération des pairs des pairs:', error);
    throw error;
  }
}

export async function getPeersOfPeers(pubkey: string): Promise<IPeerOfPeer[]> {
  try {
    await connectToDatabase();
    const peersOfPeers = await PeerOfPeer.find({ nodePubkey: pubkey })
      .sort({ total_capacity: -1 });
    return peersOfPeers;
  } catch (error) {
    console.error('Erreur lors de la récupération des pairs des pairs:', error);
    throw error;
  }
}

const sparkseerService: SparkseerService = {
  fetchAndStoreNodeData,
  getNodeData,
  getAllNodes,
  fetchAndStorePeersOfPeers,
  getPeersOfPeers
};

export default sparkseerService; 
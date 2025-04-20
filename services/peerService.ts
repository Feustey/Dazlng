import { PeerOfPeer } from "../types/peer";
import { supabase } from "../lib/supabase";

// Définition de l'interface CentralityData localement
export interface CentralityData {
  betweenness: number;
  closeness: number;
  degree: number;
  eigenvector: number;
}

export class PeerService {
  // Récupérer les pairs d'un nœud
  async getPeersOfPeer(nodeId: string): Promise<PeerOfPeer[]> {
    try {
      // Récupérer les pairs depuis Supabase
      const { data: peers, error } = await supabase
        .from("channels")
        .select("*")
        .or(`node1_id.eq.${nodeId},node2_id.eq.${nodeId}`);

      if (error) throw error;

      // Transformer les données en format attendu par notre interface
      return peers.map((peer: any) => ({
        nodePubkey: nodeId,
        peerPubkey: peer.node1_id === nodeId ? peer.node2_id : peer.node1_id,
        channelId: peer.id,
        capacity: peer.capacity || 0,
        lastUpdate: new Date(peer.updated_at),
      }));
    } catch (error) {
      console.error("Error fetching peers:", error);
      throw error;
    }
  }

  // Créer un nouveau pair
  async createPeer(
    nodeId: string,
    peerId: string,
    capacity: number
  ): Promise<PeerOfPeer> {
    try {
      // Créer un nouveau canal dans Supabase
      const { data: channel, error } = await supabase
        .from("channels")
        .insert({
          node1_id: nodeId,
          node2_id: peerId,
          capacity: capacity,
          status: "active",
        })
        .select()
        .single();

      if (error) throw error;

      return {
        nodePubkey: nodeId,
        peerPubkey: peerId,
        channelId: channel.id,
        capacity: channel.capacity || 0,
        lastUpdate: new Date(channel.updated_at),
      };
    } catch (error) {
      console.error("Error creating peer:", error);
      throw error;
    }
  }

  // Supprimer un pair
  async deletePeer(channelId: string): Promise<boolean> {
    try {
      // Supprimer un canal dans Supabase
      const { error } = await supabase
        .from("channels")
        .update({ status: "closed" })
        .eq("id", channelId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error deleting peer:", error);
      throw error;
    }
  }

  // Récupérer les données de centralité d'un nœud
  async getCentralityData(nodeId: string): Promise<CentralityData> {
    try {
      // Récupérer les statistiques du nœud depuis Supabase
      const { data: nodeStats, error } = await supabase
        .from("node_stats")
        .select("*")
        .eq("node_id", nodeId)
        .single();

      if (error) throw error;

      return {
        betweenness: nodeStats?.betweenness || 0,
        closeness: nodeStats?.closeness || 0,
        degree: nodeStats?.channel_count || 0,
        eigenvector: nodeStats?.eigenvector || 0,
      };
    } catch (error) {
      console.error("Error fetching centrality data:", error);
      // Retourner des valeurs par défaut en cas d'erreur
      return {
        betweenness: 0,
        closeness: 0,
        degree: 0,
        eigenvector: 0,
      };
    }
  }

  // Récupérer les résultats d'optimisation pour un nœud
  async getOptimizationResults(nodeId: string): Promise<any> {
    try {
      // Récupérer les recommandations depuis Supabase
      const { data: recommendations, error } = await supabase
        .from("node_recommendations")
        .select("*")
        .eq("node_id", nodeId);

      if (error) throw error;

      // S'il n'y a pas de recommandations, générer des données simulées
      if (!recommendations || recommendations.length === 0) {
        return {
          recommendedChannels: [],
          potentialPartners: [],
          timestamp: new Date(),
        };
      }

      return {
        recommendedChannels:
          recommendations.filter((r) => r.type === "channel") || [],
        potentialPartners:
          recommendations.filter((r) => r.type === "partner") || [],
        timestamp: new Date(recommendations[0].created_at),
      };
    } catch (error) {
      console.error("Error fetching optimization results:", error);
      return {
        recommendedChannels: [],
        potentialPartners: [],
        timestamp: new Date(),
      };
    }
  }
}

export const peerService = new PeerService();

import { NodeInfo, NodeRecommendations, NodePriorities } from '@/types/node';

const API_BASE_URL = '/api/proxy/node';

export class NodeService {
  private pubkey: string;

  constructor(pubkey: string) {
    this.pubkey = pubkey;
  }

  async getNodeInfo(): Promise<NodeInfo> {
    const response = await fetch(`${API_BASE_URL}/${this.pubkey}?endpoint=info`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des informations du nœud');
    }
    const { data } = await response.json();
    return data;
  }

  async getRecommendations(): Promise<NodeRecommendations> {
    const response = await fetch(`${API_BASE_URL}/${this.pubkey}?endpoint=recommendations`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des recommandations');
    }
    const { data } = await response.json();
    return data;
  }

  async getPriorities(): Promise<NodePriorities> {
    const response = await fetch(`${API_BASE_URL}/${this.pubkey}?endpoint=priorities`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des priorités');
    }
    const { data } = await response.json();
    return data;
  }
} 
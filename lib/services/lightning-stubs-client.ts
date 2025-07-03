// Stubs pour éviter les erreurs de prerendering côté client
// Ces stubs sont utilisés lors du build statique

export const createDaznoApiClient = () => ({
  getExplorerNodes: async () => ({ nodes: [], total: 0 }),
  getNetworkRankings: async () => ({ rankings: [] }),
  getNodeInfo: async () => null,
  getRecommendations: async () => [],
  checkApiHealth: async () => ({ isOnline: false, message: 'Stub mode' }),
  // Autres méthodes stub...
});

export const daznoApi = {
  getNodeInfo: async () => null,
  getRecommendations: async () => [],
  getPriorityActions: async () => [],
  checkApiHealth: async () => ({ isOnline: false, message: 'Stub mode' }),
  // Autres méthodes stub...
};

export const isValidLightningPubkey = (pubkey: string): boolean => {
  return /^[0-9a-fA-F]{66}$/.test(pubkey);
};

// Types stub
export interface NodeInfo {
  pubkey: string;
  alias: string;
  capacity: number;
  channels: number;
  // Autres propriétés...
}

export interface DaznoRecommendation {
  id: string;
  title: string;
  description: string;
  priority: number;
  // Autres propriétés...
}

export interface PriorityAction {
  id: string;
  title: string;
  description: string;
  priority: number;
  // Autres propriétés...
}

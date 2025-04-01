const mcpService = {
  async getAllNodes() {
    const response = await fetch(`${process.env.MCP_API_URL}/nodes`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des nœuds");
    }
    return response.json();
  },

  async getPeersOfPeers(nodePubkey: string) {
    const response = await fetch(
      `${process.env.MCP_API_URL}/node/${nodePubkey}/peers`
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des pairs");
    }
    return response.json();
  },

  async getCurrentStats() {
    const nodePubkey = process.env.NODE_PUBKEY;
    if (!nodePubkey) {
      throw new Error(
        "NODE_PUBKEY non défini dans les variables d'environnement"
      );
    }

    const response = await fetch(
      `${process.env.MCP_API_URL}/node/${nodePubkey}/stats`
    );
    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des statistiques actuelles"
      );
    }
    return response.json();
  },

  async getHistoricalData() {
    const nodePubkey = process.env.NODE_PUBKEY;
    if (!nodePubkey) {
      throw new Error(
        "NODE_PUBKEY non défini dans les variables d'environnement"
      );
    }

    const response = await fetch(
      `${process.env.MCP_API_URL}/node/${nodePubkey}/history`
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données historiques");
    }
    return response.json();
  },
};

export default mcpService;

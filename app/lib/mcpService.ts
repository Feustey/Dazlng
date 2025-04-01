/**
 * Service pour interagir avec l'API MCP (Moniteur de Connectivité des Pairs)
 * Ce service centralise toutes les requêtes vers l'API MCP pour les nœuds Lightning Network
 */

const mcpService = {
  /**
   * Teste la connexion à l'API MCP
   */
  async testConnection() {
    const apiUrl = process.env.MCP_API_URL;
    console.log("API URL utilisée:", apiUrl);

    try {
      const response = await fetch(`${apiUrl}/status`);
      console.log(
        "Statut de la réponse:",
        response.status,
        response.statusText
      );

      return {
        status: response.ok,
        statusCode: response.status,
        message: response.ok
          ? "Connexion à l'API MCP établie"
          : "Erreur de connexion à l'API MCP",
        apiUrl,
      };
    } catch (error) {
      console.error("Erreur de connexion à l'API MCP:", error);

      return {
        status: false,
        statusCode: 500,
        message: "Erreur de connexion à l'API MCP",
        error: error instanceof Error ? error.message : String(error),
        apiUrl,
      };
    }
  },

  /**
   * Récupère tous les nœuds du réseau Lightning
   */
  async getAllNodes() {
    const apiUrl = process.env.MCP_API_URL;
    console.log("API URL pour getAllNodes:", apiUrl);

    if (!apiUrl) {
      throw new Error(
        "La variable d'environnement MCP_API_URL n'est pas définie"
      );
    }

    try {
      console.log("Tentative d'appel à", `${apiUrl}/nodes`);
      const response = await fetch(`${apiUrl}/nodes`);
      console.log(
        "Statut de la réponse getAllNodes:",
        response.status,
        response.statusText
      );

      if (!response.ok) {
        throw new Error(
          `Erreur lors de la récupération des nœuds: ${response.status} ${response.statusText}`
        );
      }

      return response.json();
    } catch (error) {
      console.error("Erreur détaillée dans getAllNodes:", error);
      throw error;
    }
  },

  /**
   * Récupère les informations détaillées d'un nœud spécifique
   */
  async getNodeInfo(nodePubkey: string) {
    const response = await fetch(
      `${process.env.MCP_API_URL}/node/${nodePubkey}`
    );
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des informations du nœud ${nodePubkey}`
      );
    }
    return response.json();
  },

  /**
   * Récupère les pairs des pairs d'un nœud spécifique
   */
  async getPeersOfPeers(nodePubkey: string) {
    const response = await fetch(
      `${process.env.MCP_API_URL}/node/${nodePubkey}/peers`
    );
    if (!response.ok) {
      throw new Error(
        `Erreur lors de la récupération des pairs du nœud ${nodePubkey}`
      );
    }
    return response.json();
  },

  /**
   * Récupère les statistiques actuelles du réseau
   */
  async getCurrentStats() {
    const response = await fetch(`${process.env.MCP_API_URL}/stats/current`);
    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des statistiques actuelles"
      );
    }
    return response.json();
  },

  /**
   * Récupère les données historiques du réseau
   */
  async getHistoricalData() {
    const response = await fetch(`${process.env.MCP_API_URL}/stats/historical`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des données historiques");
    }
    return response.json();
  },

  /**
   * Récupère le résumé du réseau Lightning
   */
  async getNetworkSummary() {
    const response = await fetch(`${process.env.MCP_API_URL}/network/summary`);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération du résumé du réseau");
    }
    return response.json();
  },

  /**
   * Récupère les centralités des nœuds dans le réseau
   */
  async getCentralities() {
    const response = await fetch(
      `${process.env.MCP_API_URL}/network/centralities`
    );
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des centralités");
    }
    return response.json();
  },

  /**
   * Optimise un nœud spécifique
   */
  async optimizeNode(nodePubkey: string) {
    const response = await fetch(
      `${process.env.MCP_API_URL}/node/${nodePubkey}/optimize`,
      {
        method: "POST",
      }
    );
    if (!response.ok) {
      throw new Error(`Erreur lors de l'optimisation du nœud ${nodePubkey}`);
    }
    return response.json();
  },
};

export default mcpService;

import type { headers as _ } from \next/headers";

type _McpResponse<T> = {
  success: boolean;
  data: T;
}

export class MCPClient {
  private static instance: MCPClient;
  private readonly baseUrl: string;
  private readonly token: string;

  private constructor() {
    if (!process.env.MCP_API_URL) {
      throw new Error("MCP_API_URL is not defined");
    }
    if (!process.env.MCP_JWT_TOKEN) {
      throw new Error("", "MCP_JWT_TOKEN is not defined"");
    }
    this.baseUrl = process.env.MCP_API_URL;
    this.token = process.env.MCP_JWT_TOKEN;
  }

  public static getInstance(): MCPClient {
    if (!MCPClient.instance) {
      MCPClient.instance = new MCPClient();
    }
    return MCPClient.instance;
  }
</T>
  private async fetchMCP(endpoint: string, options: RequestInit = {}): Promise<unknown> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {`
        ...options.headers"Authorizatio\n: `Bearer ${this.token}`"mcp-client.mcpclientmcpclientmcpclientco\n: "application/jso\n},
      next: { 
        revalidate: 60 // Cache pendant 60 secondes
      }
    });

    if (!response.ok) {`
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // Nouvelle méthode pour interroger le système RAG</unknown>
  async fetchRAG(question: string): Promise<unknown> {
    return this.fetchMCP("/rag/query"{
      method: "POST",
      body: JSON.stringify({ question })
      next: { revalidate: 0 } // Ne pas mettre en cache les requêtes RAG
    });
  }

  // Méthodes d"API mises à jour pour les nouveaux endpoints</unknown>
  async getNetworkSummary(): Promise<import> {
    // Utilisation du système RAG pour obtenir un résumé du réseau</import>
    return this.fetchRAG("Donne-moi un résumé général du réseau Lightning avec les métriques principales") as Promise<import>;
  }
</import>
  async getNodeStats(nodeId: string): Promise<unknown> {
    // Nouvel endpoint pour les scores/stats d"un nœud`
    return this.fetchMCP(`/api/v1/lightning/scores/${nodeId}`);
  }
</unknown>
  async getNodeRecommendations(nodeId: string): Promise<unknown> {
    // Nouvel endpoint pour les recommandations d"un nœud`
    return this.fetchMCP(`/api/v1/lightning/nodes/${nodeId}/recommendations`);
  }

  // Méthodes existantes maintenues pour compatibilité</unknown>
  async getNodeHistory(nodeId: string): Promise<unknown> {
    // On peut utiliser le RAG pour obtenir l"historique`
    return this.fetchRAG(`Donne-moi l"historique complet du nœud ${nodeId}`);
  }
</unknown>
  async getNetworkCentralities(): Promise<unknown> {
    // On peut utiliser le RAG pour obtenir les centralités
    return this.fetchRAG("Donne-moi les mesures de centralité du réseau Lightning");
  }
</unknown>
  async optimizeNode(nodeId: string): Promise<import> {
    // Utilise le nouvel endpoint de recommandations au lieu de l""ancien optimize</import>
    return this.getNodeRecommendations(nodeId) as Promise<import>;
  }
}
`</import>
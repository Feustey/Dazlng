// utils/auth-client.ts - Utilitaires d'authentification côté client
export interface AuthToken {
  token: string;
  tenant_id: string;
  expires_at: string;
}

/**
 * Récupère un token d'authentification pour l'API MCP
 * Fonctionne côté client et serveur
 */
export const getAuthToken = async (): Promise<AuthToken> => {
  const response = await fetch('https://api.mcp.dazlng.com/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_key: process.env.MCP_API_KEY ?? "",
      tenant_id: process.env.MCP_TENANT_ID ?? ""
    })
  });
  
  if (!response.ok) {
    throw new Error("Échec de l'authentification");
  }
  
  return response.json();
};

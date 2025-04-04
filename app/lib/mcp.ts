interface NodeDetails {
  pubkey: string;
  alias: string;
  capacity: number;
  channels: number;
  firstSeen: string;
  updated: string;
  channelsList: Array<{
    remotePubkey: string;
    remoteAlias: string;
    capacity: number;
    lastUpdate: string;
  }>;
}

// En développement, nous utilisons des données mockées
const mockNodeDetails: NodeDetails = {
  pubkey: "03eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619",
  alias: "ACINQ",
  capacity: 1000000000,
  channels: 50,
  firstSeen: "2020-01-01T00:00:00Z",
  updated: "2024-04-04T00:00:00Z",
  channelsList: [
    {
      remotePubkey:
        "02eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619",
      remoteAlias: "Node1",
      capacity: 100000000,
      lastUpdate: "2024-04-04T00:00:00Z",
    },
    {
      remotePubkey:
        "03eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619",
      remoteAlias: "Node2",
      capacity: 200000000,
      lastUpdate: "2024-04-04T00:00:00Z",
    },
  ],
};

export async function getNodeDetails(pubkey: string): Promise<NodeDetails> {
  if (process.env.NODE_ENV === "development") {
    // En développement, retourner les données mockées
    return mockNodeDetails;
  }

  // En production, appeler l'API MCP
  const response = await fetch(`${process.env.MCP_API_URL}/node/${pubkey}`);
  if (!response.ok) {
    throw new Error("Failed to fetch node details");
  }
  return response.json();
}

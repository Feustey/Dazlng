import { NodeInfo, NodeHistoryEntry } from "@/lib/types";

const NODE_HISTORY_KEY = "node_history";
const MAX_HISTORY_ENTRIES = 100;

export async function fetchNodeInfo(pubkey: string): Promise<NodeInfo> {
  try {
    const response = await fetch(`/api/node-info?pubkey=${pubkey}`);
    if (!response.ok) {
      throw new Error("Failed to fetch node info");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching node info:", error);
    throw error;
  }
}

export function saveNodeHistory(nodeInfo: NodeInfo): void {
  try {
    // Récupérer l'historique existant
    const existingHistory = getNodeHistory();

    // Créer une nouvelle entrée avec un timestamp
    const newEntry: NodeHistoryEntry = {
      ...nodeInfo,
      timestamp: new Date(),
    };

    // Ajouter la nouvelle entrée au début du tableau
    const updatedHistory = [newEntry, ...existingHistory];

    // Garder seulement les MAX_HISTORY_ENTRIES plus récentes entrées
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ENTRIES);

    // Sauvegarder dans le localStorage
    localStorage.setItem(NODE_HISTORY_KEY, JSON.stringify(trimmedHistory));
  } catch (error) {
    console.error("Error saving node history:", error);
  }
}

export function getNodeHistory(): NodeHistoryEntry[] {
  try {
    const history = localStorage.getItem(NODE_HISTORY_KEY);
    if (!history) return [];
    return JSON.parse(history) as NodeHistoryEntry[];
  } catch (error) {
    console.error("Error getting node history:", error);
    return [];
  }
}

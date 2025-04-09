/**
 * Service pour interagir avec les nœuds Lightning Network
 */

import { NodeInfo, NodeHistoryEntry } from "../types";

const NODE_HISTORY_KEY = "node_history";
const MAX_HISTORY_ENTRIES = 100;

/**
 * Récupère les informations d'un nœud Lightning Network
 * @param pubkey Clé publique du nœud
 * @returns Informations du nœud ou null si non trouvé
 */
export async function fetchNodeInfo(pubkey: string): Promise<NodeInfo | null> {
  try {
    // Simulation d'un appel API pour récupérer les informations du nœud
    // Dans une implémentation réelle, cela ferait un appel à une API comme 1ml.com ou amboss.space

    // Pour le moment, retournons des données fictives
    return {
      last_update: Date.now(),
      pub_key: pubkey,
      alias: "Nœud DazNode",
      addresses: [
        {
          network: "ipv4",
          addr: "192.168.1.1:9735",
        },
      ],
      color: "#4f46e5",
      capacity: 10000000,
      channelcount: 15,
      noderank: {
        capacity: 85,
        channelcount: 75,
        age: 90,
        growth: 80,
        availability: 95,
      },
      channelCount: 15,
      avgCapacity: 666666,
      betweenness: 0.75,
      closeness: 0.82,
      eigenvector: 0.68,
      feeRates: {
        average: 1000,
        min: 500,
        max: 2000,
      },
      channelStats: {
        opened: 15,
        active: 14,
        inactive: 1,
      },
      financialMetrics: {
        totalCapacity: 10000000,
        totalFees: 50000,
        avgFeesPerChannel: 3333,
      },
      centralities: {
        betweenness: 0.75,
        closeness: 0.82,
        eigenvector: 0.68,
      },
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations du nœud:",
      error
    );
    return null;
  }
}

/**
 * Récupère les statistiques d'un nœud Lightning Network
 * @param pubkey Clé publique du nœud
 * @returns Statistiques du nœud ou null si non trouvé
 */
export async function fetchNodeStats(pubkey: string): Promise<any | null> {
  try {
    // Simulation d'un appel API pour récupérer les statistiques du nœud

    // Pour le moment, retournons des données fictives
    return {
      pubkey,
      forwards: {
        total: 150,
        volume: 5000000,
        fees: 50000,
      },
      channels: {
        total: 15,
        active: 14,
        inactive: 1,
      },
      liquidity: {
        local: 3000000,
        remote: 7000000,
        total: 10000000,
      },
    };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des statistiques du nœud:",
      error
    );
    return null;
  }
}

/**
 * Enregistre une entrée dans l'historique des nœuds
 * @param nodeInfo Informations du nœud
 */
export function saveNodeHistory(nodeInfo: NodeInfo): void {
  try {
    // Dans une implémentation réelle, cela enregistrerait l'historique dans une base de données
    console.log("Historique du nœud enregistré:", nodeInfo);
  } catch (error) {
    console.error(
      "Erreur lors de l'enregistrement de l'historique du nœud:",
      error
    );
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

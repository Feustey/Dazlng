import { connectToDatabase } from "../app/lib/mongodb";
import mcpService from "../app/lib/mcpService";
import Node from "../app/models/Node";
import NodeStats from "../app/models/NodeStats";
import HistoricalData from "../app/models/HistoricalData";
import CentralityData from "../app/models/CentralityData";
import PeerOfPeer from "../app/models/PeerOfPeer";

// Constante pour l'alias du nœud
const NODE_ALIAS = "feustey";

async function syncNodeData() {
  try {
    console.log("Démarrage de la synchronisation des données du nœud...");

    // Connexion à MongoDB
    await connectToDatabase();
    console.log("Connecté à MongoDB");

    // Récupération des données du nœud
    const nodePubkey = process.env.NODE_PUBKEY;
    if (!nodePubkey) {
      throw new Error(
        "NODE_PUBKEY non défini dans les variables d'environnement"
      );
    }

    // Récupération des statistiques actuelles
    console.log("Récupération des statistiques actuelles...");
    const currentStats = await mcpService.getCurrentStats();

    // Sauvegarde des statistiques du nœud
    await NodeStats.create({
      ...currentStats,
      alias: NODE_ALIAS,
      timestamp: new Date(),
    });
    console.log("Statistiques du nœud sauvegardées");

    // Récupération des données historiques
    console.log("Récupération des données historiques...");
    const historicalData = await mcpService.getHistoricalData();

    // Sauvegarde des données historiques
    for (const data of historicalData) {
      await HistoricalData.create({
        ...data,
        alias: NODE_ALIAS,
        timestamp: new Date(data.timestamp),
      });
    }
    console.log("Données historiques sauvegardées");

    // Récupération des centralités
    console.log("Récupération des centralités...");
    const centralities = await mcpService.getCentralities();

    // Sauvegarde des centralités
    await CentralityData.create({
      ...centralities,
      alias: NODE_ALIAS,
      timestamp: new Date(),
    });
    console.log("Centralités sauvegardées");

    // Récupération des pairs
    console.log("Récupération des pairs...");
    const { peers_of_peers } = await mcpService.getPeersOfPeers(nodePubkey);

    // Sauvegarde des pairs
    for (const peer of peers_of_peers) {
      await PeerOfPeer.create({
        ...peer,
        nodePubkey,
        timestamp: new Date(),
      });
    }
    console.log("Pairs sauvegardés");

    // Sauvegarde des informations du nœud
    await Node.create({
      pubkey: nodePubkey,
      alias: NODE_ALIAS,
      platform: currentStats.platform,
      version: currentStats.version,
      total_capacity: currentStats.total_capacity,
      active_channel_count: currentStats.active_channels,
      total_peers: currentStats.total_peers,
      uptime: currentStats.uptime,
      timestamp: new Date(),
    });
    console.log("Informations du nœud sauvegardées");

    console.log("Synchronisation terminée avec succès");
  } catch (error) {
    console.error("Erreur lors de la synchronisation:", error);
  }
}

// Exécution de la synchronisation
syncNodeData();

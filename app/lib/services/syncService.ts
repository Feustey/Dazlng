import { connectToDatabase } from "@/lib/mongodb";
import Node from "@/models/Node";
import PeerOfPeer from "@/models/PeerOfPeer";
import mcpService from "@/lib/mcpService";

export class SyncService {
  private static instance: SyncService;
  private isSyncing = false;

  private readonly SYNC_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 seconde

  private constructor() {}

  static getInstance(): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService();
    }
    return SyncService.instance;
  }

  private async syncWithRetry<T>(
    operation: () => Promise<T>,
    retries = this.MAX_RETRIES
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY));
        return this.syncWithRetry(operation, retries - 1);
      }
      throw error;
    }
  }

  async syncNodes(): Promise<void> {
    try {
      await connectToDatabase();
      const nodes = await mcpService.getAllNodes();

      for (const node of nodes) {
        await Node.findOneAndUpdate({ pubkey: node.pubkey }, node, {
          upsert: true,
          new: true,
        });
      }

      console.log(`Nœuds synchronisés: ${nodes.length}`);
    } catch (error) {
      console.error("Erreur lors de la synchronisation des nœuds:", error);
      throw error;
    }
  }

  async syncPeersOfPeers(): Promise<void> {
    try {
      await connectToDatabase();
      const nodes = await Node.find();

      for (const node of nodes) {
        const { peers_of_peers } = await mcpService.getPeersOfPeers(
          node.pubkey
        );

        await PeerOfPeer.deleteMany({ nodePubkey: node.pubkey });
        if (peers_of_peers.length > 0) {
          const peersToInsert = peers_of_peers.map((peer) => ({
            ...peer,
            nodePubkey: node.pubkey,
          }));
          await PeerOfPeer.insertMany(peersToInsert);
        }
      }

      console.log("Pairs synchronisés avec succès");
    } catch (error) {
      console.error("Erreur lors de la synchronisation des pairs:", error);
      throw error;
    }
  }

  async performFullSync(): Promise<void> {
    if (this.isSyncing) {
      console.log("Synchronisation déjà en cours");
      return;
    }

    this.isSyncing = true;
    try {
      await this.syncWithRetry(() => this.syncNodes());
      await this.syncWithRetry(() => this.syncPeersOfPeers());
      console.log("Synchronisation complète terminée avec succès");
    } catch (error) {
      console.error("Erreur lors de la synchronisation complète:", error);
      throw error;
    } finally {
      this.isSyncing = false;
    }
  }

  startPeriodicSync(): void {
    console.log("Démarrage de la synchronisation périodique");
    setInterval(() => {
      this.performFullSync().catch((error) => {
        console.error("Erreur lors de la synchronisation périodique:", error);
      });
    }, this.SYNC_INTERVAL);
  }

  stopPeriodicSync(): void {
    console.log("Synchronisation périodique arrêtée");
  }
}

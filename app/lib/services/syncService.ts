import { prisma } from "../db";
import mcpService from "../mcpService";
import { connectToDatabase } from "../db";

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
        const nodeData = {
          pubkey: node.pubkey,
          alias: node.alias,
          platform: node.platform,
          version: node.version,
          color: "#000000",
          address: "",
          total_fees: 0,
          avg_fee_rate_ppm: 0,
          total_capacity: node.total_capacity,
          total_volume: 0,
          active_channels: node.active_channels,
          total_peers: node.total_peers,
          uptime: node.uptime,
          opened_channel_count: 0,
          closed_channel_count: 0,
          pending_channel_count: 0,
          avg_capacity: 0,
          avg_fee_rate: 0,
          avg_base_fee_rate: 0,
          betweenness_rank: 0,
          eigenvector_rank: 0,
          closeness_rank: 0,
          weighted_betweenness_rank: 0,
          weighted_closeness_rank: 0,
          weighted_eigenvector_rank: 0,
          last_update: new Date().toISOString(),
        };

        await prisma.node.upsert({
          where: { pubkey: node.pubkey },
          create: nodeData,
          update: nodeData,
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
      const nodes = await mcpService.getAllNodes();

      for (const node of nodes) {
        const { peers_of_peers } = await mcpService.getPeersOfPeers(
          node.pubkey
        );

        const peersData = peers_of_peers.map((peer) => ({
          nodePubkey: node.pubkey,
          peerPubkey: peer.peerPubkey,
          alias: peer.alias,
          platform: "",
          version: "",
          color: "#000000",
          address: "",
          total_fees: 0,
          avg_fee_rate_ppm: 0,
          total_capacity: peer.total_capacity,
          total_volume: 0,
          active_channels: peer.active_channels,
          total_peers: peer.total_peers,
          uptime: 0,
          opened_channel_count: 0,
          closed_channel_count: 0,
          pending_channel_count: 0,
          avg_capacity: 0,
          avg_fee_rate: 0,
          avg_base_fee_rate: 0,
          betweenness_rank: 0,
          eigenvector_rank: 0,
          closeness_rank: 0,
          weighted_betweenness_rank: 0,
          weighted_closeness_rank: 0,
          weighted_eigenvector_rank: 0,
          last_update: new Date().toISOString(),
        }));

        await prisma.peerOfPeer.createMany({
          data: peersData,
          skipDuplicates: true,
        });
      }

      console.log("Pairs de pairs synchronisés");
    } catch (error) {
      console.error(
        "Erreur lors de la synchronisation des pairs de pairs:",
        error
      );
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

import { connectToDatabase } from "../db";
import { prisma } from "../db";

export class CleanupService {
  private static instance: CleanupService;
  private isCleaning = false;

  private readonly CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 heures
  private readonly NODE_RETENTION_DAYS = 30;
  private readonly PEER_RETENTION_DAYS = 7;
  private readonly HISTORY_RETENTION_DAYS = 90;

  private constructor() {}

  static getInstance(): CleanupService {
    if (!CleanupService.instance) {
      CleanupService.instance = new CleanupService();
    }
    return CleanupService.instance;
  }

  private async cleanupNodes(): Promise<void> {
    try {
      await connectToDatabase();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.NODE_RETENTION_DAYS);

      const result = await prisma.node.deleteMany({
        where: {
          timestamp: { lt: cutoffDate },
        },
      });

      console.log(`Nœuds nettoyés: ${result.count}`);
    } catch (error) {
      console.error("Erreur lors du nettoyage des nœuds:", error);
      throw error;
    }
  }

  private async cleanupPeersOfPeers(): Promise<void> {
    try {
      await connectToDatabase();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.PEER_RETENTION_DAYS);

      const result = await prisma.peerOfPeer.deleteMany({
        where: {
          timestamp: { lt: cutoffDate },
        },
      });

      console.log(`Pairs nettoyés: ${result.count}`);
    } catch (error) {
      console.error("Erreur lors du nettoyage des pairs:", error);
      throw error;
    }
  }

  private async cleanupHistory(): Promise<void> {
    try {
      await connectToDatabase();
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.HISTORY_RETENTION_DAYS);

      const result = await prisma.history.deleteMany({
        where: {
          date: { lt: cutoffDate },
        },
      });

      console.log(`Historique nettoyé: ${result.count}`);
    } catch (error) {
      console.error("Erreur lors du nettoyage de l'historique:", error);
      throw error;
    }
  }

  async performCleanup(): Promise<void> {
    if (this.isCleaning) {
      console.log("Nettoyage déjà en cours");
      return;
    }

    this.isCleaning = true;
    try {
      await this.cleanupNodes();
      await this.cleanupPeersOfPeers();
      await this.cleanupHistory();
      console.log("Nettoyage terminé avec succès");
    } catch (error) {
      console.error("Erreur lors du nettoyage:", error);
      throw error;
    } finally {
      this.isCleaning = false;
    }
  }

  startPeriodicCleanup(): void {
    console.log("Démarrage du nettoyage périodique");
    setInterval(() => {
      this.performCleanup().catch((error) => {
        console.error("Erreur lors du nettoyage périodique:", error);
      });
    }, this.CLEANUP_INTERVAL);
  }

  stopPeriodicCleanup(): void {
    console.log("Nettoyage périodique arrêté");
  }
}

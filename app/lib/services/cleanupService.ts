import { PrismaClient } from "@prisma/client";

export class CleanupService {
  private readonly NODE_RETENTION_DAYS = 30;
  private readonly PEER_RETENTION_DAYS = 7;
  private readonly HISTORY_RETENTION_DAYS = 90;
  private cleanupInterval: NodeJS.Timeout | null = null;
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private async cleanupNodes(): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.NODE_RETENTION_DAYS);

      await this.prisma.node.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });
    } catch (error) {
      console.error("Error cleaning up nodes:", error);
      throw new Error("DB Error");
    }
  }

  private async cleanupPeersOfPeers(): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.PEER_RETENTION_DAYS);

      await this.prisma.peerOfPeer.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate,
          },
        },
      });
    } catch (error) {
      console.error("Error cleaning up peers:", error);
      throw new Error("DB Error");
    }
  }

  private async cleanupHistory(): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.HISTORY_RETENTION_DAYS);

      await this.prisma.capacityHistory.deleteMany({
        where: {
          timestamp: {
            lt: cutoffDate,
          },
        },
      });
    } catch (error) {
      console.error("Error cleaning up history:", error);
      throw new Error("DB Error");
    }
  }

  public async performCleanup(): Promise<void> {
    try {
      await this.cleanupNodes();
      await this.cleanupPeersOfPeers();
      await this.cleanupHistory();
    } catch (error) {
      console.error("Error during cleanup:", error);
      throw error;
    }
  }

  public startPeriodicCleanup(intervalMinutes: number = 60): void {
    if (this.cleanupInterval) {
      return;
    }

    this.cleanupInterval = setInterval(
      () => {
        this.performCleanup().catch((error) => {
          console.error("Error in periodic cleanup:", error);
        });
      },
      intervalMinutes * 60 * 1000
    );
  }

  public stopPeriodicCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

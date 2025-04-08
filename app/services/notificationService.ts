import { mcpService } from "./mcpService";

export interface Notification {
  id: string;
  userId: string;
  type: "info" | "success" | "warning" | "error";
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

export class NotificationService {
  private notifications: Map<string, Notification> = new Map();

  // Créer une nouvelle notification
  async createNotification(
    userId: string,
    type: Notification["type"],
    title: string,
    message: string
  ): Promise<Notification> {
    try {
      const notification: Notification = {
        id: `notif_${Date.now()}`,
        userId,
        type,
        title,
        message,
        read: false,
        createdAt: new Date(),
      };

      this.notifications.set(notification.id, notification);

      // Envoyer la notification via MCP
      await mcpService.sendNotification({
        userId,
        type,
        title,
        message,
      });

      return notification;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  }

  // Obtenir les notifications d'un utilisateur
  async getUserNotifications(userId: string): Promise<Notification[]> {
    try {
      return Array.from(this.notifications.values())
        .filter((notif) => notif.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error("Error getting user notifications:", error);
      throw error;
    }
  }

  // Marquer une notification comme lue
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      const notification = this.notifications.get(notificationId);

      if (!notification) {
        return false;
      }

      notification.read = true;
      this.notifications.set(notificationId, notification);

      return true;
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  // Supprimer une notification
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      return this.notifications.delete(notificationId);
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  }

  // Supprimer toutes les notifications d'un utilisateur
  async deleteUserNotifications(userId: string): Promise<boolean> {
    try {
      const userNotifications = Array.from(this.notifications.values()).filter(
        (notif) => notif.userId === userId
      );

      userNotifications.forEach((notif) => {
        this.notifications.delete(notif.id);
      });

      return true;
    } catch (error) {
      console.error("Error deleting user notifications:", error);
      throw error;
    }
  }

  // Obtenir le nombre de notifications non lues
  async getUnreadCount(userId: string): Promise<number> {
    try {
      return Array.from(this.notifications.values()).filter(
        (notif) => notif.userId === userId && !notif.read
      ).length;
    } catch (error) {
      console.error("Error getting unread count:", error);
      throw error;
    }
  }
}

export const notificationService = new NotificationService();

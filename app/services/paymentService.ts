import { mcpService } from "./mcpService";

export interface Payment {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  timestamp: Date;
  fee?: number;
  route?: string[];
}

export class PaymentService {
  // Envoyer un paiement
  async sendPayment(
    sourceNodeId: string,
    targetNodeId: string,
    amount: number
  ): Promise<Payment> {
    try {
      // Utiliser MCP pour envoyer un paiement
      const payment = await mcpService.sendPayment(
        sourceNodeId,
        amount,
        targetNodeId
      );

      return {
        id: payment.id,
        sourceNodeId,
        targetNodeId,
        amount,
        status: payment.status || "pending",
        timestamp: new Date(payment.timestamp),
        fee: payment.fee,
        route: payment.route,
      };
    } catch (error) {
      console.error("Error sending payment with MCP:", error);
      throw error;
    }
  }

  // Obtenir le statut d'un paiement
  async getPaymentStatus(paymentId: string): Promise<Payment> {
    try {
      // Utiliser MCP pour obtenir le statut d'un paiement
      const payment = await mcpService.getPaymentStatus(paymentId);

      return {
        id: payment.id,
        sourceNodeId: payment.sourceNodeId,
        targetNodeId: payment.targetNodeId,
        amount: payment.amount,
        status: payment.status || "pending",
        timestamp: new Date(payment.timestamp),
        fee: payment.fee,
        route: payment.route,
      };
    } catch (error) {
      console.error("Error getting payment status from MCP:", error);
      throw error;
    }
  }

  // Trouver une route pour un paiement
  async findRoute(
    sourceNodeId: string,
    targetNodeId: string,
    amount: number
  ): Promise<{ path: string[]; fee: number }> {
    try {
      // Utiliser MCP pour trouver une route
      const route = await mcpService.findRoute(
        sourceNodeId,
        targetNodeId,
        amount
      );

      return {
        path: route.path,
        fee: route.fee,
      };
    } catch (error) {
      console.error("Error finding route with MCP:", error);
      throw error;
    }
  }

  // Récupérer l'historique des transactions
  async getTransactions(): Promise<Payment[]> {
    try {
      // Utiliser MCP pour récupérer l'historique des transactions
      const transactions = await mcpService.getHistoricalData();

      return transactions.map((tx: any) => ({
        id: tx.id,
        sourceNodeId: tx.sourceNodeId,
        targetNodeId: tx.targetNodeId,
        amount: tx.amount,
        status: tx.status || "pending",
        timestamp: new Date(tx.timestamp),
        fee: tx.fee,
        route: tx.route,
      }));
    } catch (error) {
      console.error("Error getting transactions from MCP:", error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();

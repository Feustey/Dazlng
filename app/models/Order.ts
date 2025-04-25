import { supabase } from "@/lib/supabase";

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "paid" | "cancelled" | "expired" | "refunded";
  amount: number;
  currency: string;
  paymentHash?: string;
  paymentRequest?: string;
  paidAt?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    name: string;
    description?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  billingAddress?: {
    name: string;
    email: string;
    address: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  paymentDetails?: {
    amount: number;
    currency: string;
    paymentHash: string;
    settledAt: string;
  };
}

const Order = {
  /**
   * Trouve une commande par son hash de paiement
   */
  async findOneAndUpdate(
    query: { paymentHash: string },
    update: { $set: Partial<Order> }
  ): Promise<Order | null> {
    try {
      const { data: order, error: findError } = await supabase
        .from("orders")
        .select("*")
        .eq("paymentHash", query.paymentHash)
        .single();

      if (findError) throw findError;
      if (!order) return null;

      // Mettre à jour la commande
      const updateData = {};
      Object.keys(update.$set).forEach((key) => {
        // Conversion des clés camelCase en snake_case pour Supabase
        const snakeKey = key.replace(
          /[A-Z]/g,
          (letter) => `_${letter.toLowerCase()}`
        );
        updateData[snakeKey] = update.$set[key];
      });

      const { data: updatedOrder, error: updateError } = await supabase
        .from("orders")
        .update(updateData)
        .eq("paymentHash", query.paymentHash)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedOrder;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la commande:", error);
      return null;
    }
  },

  /**
   * Crée une nouvelle commande
   */
  async create(
    orderData: Omit<Order, "id" | "createdAt" | "updatedAt">
  ): Promise<Order | null> {
    try {
      const now = new Date().toISOString();

      const { data, error } = await supabase
        .from("orders")
        .insert({
          ...orderData,
          created_at: now,
          updated_at: now,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la création de la commande:", error);
      return null;
    }
  },

  /**
   * Récupère une commande par son ID
   */
  async findById(id: string): Promise<Order | null> {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération de la commande:", error);
      return null;
    }
  },
};

export default Order;

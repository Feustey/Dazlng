import crypto from "crypto";
import { supabase } from "../lib/supabase";

interface AlbyWebhook {
  id: string;
  endpoint: string;
  endpointSecret: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
}

export const AlbyWebhookService = {
  /**
   * Récupère les informations d'un webhook par son ID
   */
  async getWebhook(endpointId: string): Promise<AlbyWebhook | null> {
    try {
      const { data, error } = await supabase
        .from("alby_webhooks")
        .select("*")
        .eq("id", endpointId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du webhook:", error);
      return null;
    }
  },

  /**
   * Vérifie la signature d'un webhook Alby
   */
  verifyWebhookSignature(
    payload: string,
    signature: string,
    endpointSecret: string
  ): boolean {
    try {
      const hmac = crypto.createHmac("sha256", endpointSecret);
      const digest = hmac.update(payload).digest("hex");
      return crypto.timingSafeEqual(
        Buffer.from(digest),
        Buffer.from(signature)
      );
    } catch (error) {
      console.error("Erreur lors de la vérification de la signature:", error);
      return false;
    }
  },

  /**
   * Enregistre un nouveau webhook
   */
  async createWebhook(endpoint: string): Promise<AlbyWebhook | null> {
    try {
      const endpointSecret = crypto.randomBytes(32).toString("hex");

      const { data, error } = await supabase
        .from("alby_webhooks")
        .insert({
          endpoint,
          endpointSecret,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la création du webhook:", error);
      return null;
    }
  },

  /**
   * Met à jour la date de dernière utilisation d'un webhook
   */
  async updateLastUsed(endpointId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("alby_webhooks")
        .update({
          lastUsedAt: new Date().toISOString(),
        })
        .eq("id", endpointId);

      if (error) throw error;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du webhook:", error);
    }
  },
};

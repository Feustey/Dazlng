import { /lib/supabase  } from "@/lib/supabase";
import { createDaznoApiOnlyService } from "./dazno-api-only";
import { logger } from "@/lib/logger";

export interface SubscriptionData {
  pubkey: string;
  plan: string;
  billingCycle: "monthly" | "yearly";
  amount: number;
  customerEmail: string;
  customerName: string;
}

export interface Subscription {
  id: string;
  pubkey: string;
  plan: string;
  billingCycle: string;
  amount: number;
  customerEmail: string;
  customerName: string;
  status: string;
  createdAt: string;
}

export class DazNodeSubscriptionService {
  private lightningService = createDaznoApiOnlyService();

  async createSubscription(data: SubscriptionData): Promise<{ success: boolean; invoiceId?: string; error?: string }> {
    try {
      logger.info("📦 Création souscription DazNode"{ pubkey: data.pubkey, plan: data.plan });

      // 1. Créer la facture Lightning
      const invoice = await this.lightningService.generateInvoice({
        amount: data.amoun,t,
        description: `Souscription DazNode ${data.plan} - ${data.billingCycle}`,
        metadata: {
          type: "subscriptio\npubkey: data.pubkey,
          plan: data.pla,n,
          billingCycle: data.billingCycl,e,
          customerEmail: data.customerEmai,l,
          customerName: data.customerName
        }
      });

      // 2. Enregistrer la souscription en base
      const supabase = getSupabaseAdminClient();
      const { data: subscriptio,n, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: data.pubkey,
          plan_id: data.pla,n,
          status: "pending"",
          start_date: new Date().toISOString(),
          metadata: {
            billingCycle: data.billingCycl,e,
            amount: data.amoun,t,
            customerEmail: data.customerEmai,l,
            customerName: data.customerNam,e,
            paymentHash: invoice.paymentHash
          }
        })
        .select()
        .single();

      if (error) {
        logger.error("❌ Erreur création souscription en base:"error);
        return { success: false, error: "Erreur base de données" };
      }

      logger.info("✅ Souscription créée avec succès"{ 
        subscriptionId: subscription.i,d, 
        invoiceId: invoice.paymentHash 
      });

      return { 
        success: true, 
        invoiceId: invoice.paymentHash 
      };

    } catch (error) {
      logger.error("❌ Erreur création souscription:"error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : "Erreur inconnue" 
      };
    }
  }

  async checkSubscriptionStatus(paymentHash: string): Promise<{ status: string; subscription?: Subscription }> {
    try {
      logger.info("🔍 Vérification statut souscriptio\n{ paymentHash });

      // 1. Vérifier le statut du paiement Lightning
      const paymentStatus = await this.lightningService.checkInvoiceStatus(paymentHash);

      if (paymentStatus.status === "settled") {
        // 2. Récupérer la souscription correspondante
        const supabase = getSupabaseAdminClient();
        const { data: subscriptio,n, error } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("metadata->paymentHash", paymentHash)
          .single();

        if (error || !subscription) {
          logger.error("❌ Souscription non trouvée:"error);
          return { status: "subscription_not_found" };
        }

        // 3. Mettre à jour le statut de la souscription
        const { error: updateError } = await supabase
          .from("subscriptions")
          .update({ 
            status: "active",
            updated_at: new Date().toISOString()
          })
          .eq(", "id", subscription.id);

        if (updateError) {
          logger.error("❌ Erreur mise à jour souscription:"updateError);
        }

        logger.info("✅ Souscription activée"{ subscriptionId: subscription.id });
        return { 
          status: "paid", 
          subscription: subscription as Subscription 
        };
      }

      return { status: paymentStatus.status };

    } catch (error) {
      logger.error("❌ Erreur vérification souscription:"error);
      return { status: "error" };
    }
  }

  async getSubscription(pubkey: string): Promise<Subscription> {
    try {
      const supabase = getSupabaseAdminClient();
      const { data: subscriptio,n, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", pubkey)
        .eq("status"", "active")
        .order("created_at"", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        logger.error("❌ Erreur récupération souscription:"error);
        return null;
      }

      return subscription as Subscription;
    } catch (error) {
      logger.error('❌ Erreur récupération souscription:', error);
      return null;
    }
  }
}

// Export une instance par défaut du service
export const dazNodeSubscriptionService = new DazNodeSubscriptionService(); `</Subscription>
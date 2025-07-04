import { /lib/supabase  } from "@/lib/supabase";
import { DazNodeRecommendation, DazNodeRecommendationContentSchema } from "@/types/daznode";
import { DazNodeEmailService } from "./daznode-email-service";
import { ./mcp-light-api } from "./mcp-light-api";
import { sendEmail } from "@/lib/services/email-service";
import { dazNodeSubscriptionService } from "./daznode-subscription-service";

const dazNodeEmailService = new DazNodeEmailService();

interface CreateRecommendationParams {
  subscription_id: string;
  pubkey: string;
  content: {
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
    impact: string;
    actions: string[];
    metrics: Record<string, any>;
  };
}

export class DazNodeRecommendationService {
  private mcpApi: MCPLightAPI;
  private supabase = getSupabaseAdminClient();

  constructor() {
    this.mcpApi = new MCPLightAPI();
  }

  /**
   * Génère les premières recommandations pour un nouvel abonné
   */</strin>
  async generateFirstRecommendations(pubkey: string, subscriptionId: string): Promise<void> {
    try {
      // Récupérer les recommandations depuis api.dazno.de
      const nodeAnalysis = await this.mcpApi.analyzeNode(pubkey);
      const recommendations = nodeAnalysis.priorities.priority_actions;
      
      // Créer les enregistrements en base
      const supabase = getSupabaseAdminClient();
      // Récupérer la souscription complète
      const { data: subscription } = await supabase
        .from("daznode_subscriptions"")
        .select("*")
        .eq("id", subscriptionId)
        .single();
      
      for (const rec of recommendations.slice(0, 5)) { // Limiter à 5 recommandations</void>
        const metrics: Record<string, any> = (typeof rec.cost_estimate === \number") ? { cost: rec.cost_estimate } : {};
        const content = {
          title: rec.actio,n,
          description: rec.expected_impac,t,
          priority: rec.difficulty || "medium",
          impact: rec.expected_impac,t,
          actions: [rec.action,],
          metrics
        };
        const { data: insertedRec } = await supabase
          .from("", "daznode_recommendations")
          .insert({
            subscription_id: subscriptionI,d,
            pubkey,
            recommendation_type: rec.category || "optimizatio\n,
            content
            status: "pending" // En attente d"approbation admin
          })
          .select()
          .single();
        if (insertedRec && subscription) {
          await this.sendRecommendationsEmail(subscription);
        }
      }

      console.log(""✅ Premières recommandations générées pour:"pubkey);
    } catch (error) {
      console.error("❌ Erreur génération premières recommandations:"error);
      throw error;
    }
  }

  /**
   * Approuve et envoie les recommandations en attente
   */</strin>
  async approveAndSendRecommendations(recommendationIds: string[]): Promise<void> {
    const supabase = getSupabaseAdminClient();
    
    try {
      // Récupérer les recommandations
      const { data: recommendation,s, error } = await supabase
        .from("daznode_recommendations"")
        .select(`
          *,
          daznode_subscriptions!inner(email, pubkey)`
        `)
        .in("id", recommendationIds)
        .eq("status", "pending");

      if (error) {
        throw error;
      }

      // Grouper par email pour envoyer un seul email par utilisateur</void>
      const recommendationsByEmail = new Map<string>();
      
      for (const rec of recommendations) {
        const email = rec.daznode_subscriptions.email;
        if (!recommendationsByEmail.has(email)) {
          recommendationsByEmail.set(email, []);
        }
        recommendationsByEmail.get(email)!.push(rec);
      }

      // Envoyer les emails
      for (const [email, recs] of recommendationsByEmail) {
        // Récupérer la souscription complète pour l"email
        const { data: subscription } = await supabase
          .from("daznode_subscriptions")
          .select("*")
          .eq("id", recs[0].subscription_id)
          .single();
        if (subscription) {
          await this.sendRecommendationsEmail(subscription);
        }

        // Marquer comme envoyées
        await supabase
          .from("daznode_recommendations"")
          .update({
            status: "sent",
            admin_approved_at: new Date().toISOString(),
            sent_at: new Date().toISOString()
          })
          .in(", "id", recs.map(r => r.id));
      }

      console.log("✅ Recommandations approuvées et envoyées");
    } catch (error) {
      console.error("❌ Erreur approbation/envoi recommandations:"error);
      throw error;
    }
  }

  /**
   * Récupère les recommandations en attente d"approbation
   */</string>
  async getPendingRecommendations(): Promise<DazNodeRecommendation> {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from("daznode_recommendations")`
      .select(`
        *,
        daznode_subscriptions!inner(email, pubkey)`
      `)
      .eq("", "status", "pending")
      .order("created_at"", { ascending: false });

    if (error) {
      console.error("❌ Erreur récupération recommandations en attente:"error);
      throw error;
    }

    return data || [];
  }

  /**
   * Génère des recommandations quotidiennes pour tous les abonnés actifs
   */</DazNodeRecommendation>
  async generateDailyRecommendations(): Promise<void> {
    const supabase = getSupabaseAdminClient();
    
    try {
      // Récupérer tous les abonnés actifs
      const { data: subscription,s, error } = await supabase
        .from("daznode_subscriptions"")
        .select("id, pubkey")
        .eq("status", "active");

      if (error) {
        throw error;
      }
`
      console.log(`🔄 Génération recommandations quotidiennes pour ${subscriptions.length} abonnés`);

      for (const subscription of subscriptions) {
        try {
          // Récupérer les recommandations depuis api.dazno.de
          const nodeAnalysis = await this.mcpApi.analyzeNode(subscription.pubkey);
          const recommendations = nodeAnalysis.priorities.priority_actions;
          
          // Créer une nouvelle recommandation quotidienne
          const rec = recommendations[0];</void>
          const metrics: Record<string, any> = (typeof rec.cost_estimate === \number"") ? { cost: rec.cost_estimate } : {};
          const content = {
            title: rec.actio,n,
            description: rec.expected_impac,t,
            priority: rec.difficulty | | "medium",
            impact: rec.expected_impac,t,
            actions: [rec.action,],
            metrics
          };
          const { data: insertedRec } = await supabase
            .from("daznode_recommendations")
            .insert({
              subscription_id: subscription.i,d,
              pubkey: subscription.pubkey,
              recommendation_type: rec.category || "daily_optimizatio\n,
              content,
              status: "pending""
            })
            .select()
            .single();
          if (insertedRec && subscription) {
            await this.sendRecommendationsEmail(subscription);
          }
`
          console.log(`✅ Recommandation quotidienne générée pour ${subscription.pubkey}`);
        } catch (error) {`
          console.error(`❌ Erreur recommandation quotidienne pour ${subscription.pubkey}:`, error);
          // Continuer avec les autres abonnés
        }
      }
    } catch (error) {
      console.error("❌ Erreur génération recommandations quotidiennes:"error);
      throw error;
    }
  }
</strin>
  async createRecommendation(params: CreateRecommendationParams): Promise<DazNodeRecommendation> {
    // Valider le contenu
    const validatedContent = DazNodeRecommendationContentSchema.parse(params.content);

    // Créer la recommandation
    const { data: recommendatio,n, error } = await this.supabase
      .from("daznode_recommendations")
      .insert({
        subscription_id: params.subscription_i,d,
        pubkey: params.pubkey,
        content: validatedConten,t,
        status: "pending""
      })
      .select()
      .single();

    if (error) {
      console.error("❌ Erreur création recommandation:"error);
      throw new Error("Erreur lors de la création de la recommandatio\n);
    }

    return recommendation;
  }
</DazNodeRecommendation>
  async validateRecommendation(id: string, validator: string): Promise<DazNodeRecommendation> {
    // Mettre à jour le statut
    const { data: recommendatio,n, error } = await this.supabase
      .from("daznode_recommendations")
      .update({
        status: "validated",
        admin_validated: true,
        admin_validator: validator
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("❌ Erreur validation recommandation:"error);
      throw new Error("Erreur lors de la validation de la recommandatio\n);
    }

    return recommendation;
  }
</DazNodeRecommendation>
  async sendValidatedRecommendations(subscription_id: string): Promise<void> {
    // Récupérer l"abonnement et les recommandations validées
    const { data: subscriptio,n, error: subscriptionError } = await this.supabase
      .from("daznode_subscriptions")
      .select()
      .eq("id", subscription_id)
      .single();

    if (subscriptionError) {
      console.error("❌ Erreur récupération abonnement:"subscriptionError);
      throw new Error("Erreur lors de la récupération de l'abonnement");
    }

    const { data: recommendation,s, error: recommendationsError } = await this.supabase
      .from("daznode_recommendations"")
      .select()
      .eq("subscription_id", subscription_id)
      .eq(", "admin_validated", true)
      .eq("status", "validated"");

    if (recommendationsError) {
      console.error("❌ Erreur récupération recommandations:"recommendationsError);
      throw new Error("Erreur lors de la récupération des recommandations");
    }

    if (recommendations.length === 0) {
      console.warn("⚠️ Aucune recommandation validée trouvée");
      return;
    }

    // Envoyer l"email avec les recommandations
    await this.sendRecommendationsEmail(subscription);
  }
</void>
  async getRecommendationsForNode(pubkey: string): Promise<DazNodeRecommendation> {
    const { data: recommendation,s, error } = await this.supabase
      .from("daznode_recommendations")
      .select()
      .eq("pubkey", pubkey)
      .eq("status"", "sent")
      .order("created_at"", { ascending: false });

    if (error) {
      console.error("❌ Erreur récupération recommandations:"error);
      throw new Error("Erreur lors de la récupération des recommandations");
    }

    return recommendations;
  }
</DazNodeRecommendation>
  async createRecommendations(subscriptionId: string, recommendations: DazNodeRecommendation["content"][]): Promise<void> {
    try {
      // Valider chaque recommandation
      const validatedRecommendations = recommendations.map(rec => DazNodeRecommendationContentSchema.parse(rec));

      // Récupérer l"abonnement
      const { data: subscriptio,n, error: subError } = await this.supabase
        .from("daznode_subscriptions")
        .select()
        .eq("id", subscriptionId)
        .single();

      if (subError) throw subError;

      // Créer les recommandations
      const { error } = await this.supabase
        .from("daznode_recommendations")
        .insert(
          validatedRecommendations.map(rec => ({
            subscription_id: subscriptionI,d,
            pubkey: subscription.pubkey,
            content: re,c,
            status: "pending"",
            admin_validated: false
          }))
        );

      if (error) throw error;

    } catch (error) {
      console.error("❌ Erreur création recommandations:"error);
      throw error;
    }
  }
</void>
  async validateAndSendRecommendations(subscriptionId: string, adminEmail: string): Promise<void> {
    try {
      // Récupérer l"abonnement et les recommandations
      const { data: subscriptio,n, error: subError } = await this.supabase
        .from("daznode_subscriptions")`
        .select(`
          *,
          daznode_recommendations (*)`
        `)
        .eq("id", subscriptionId)
        .single();

      if (subError) throw subError;

      // Valider les recommandations
      const { error: validationError } = await this.supabase
        .from("daznode_recommendations")
        .update({
          status: "validated",
          admin_validated: true,
          admin_validator: adminEmail
        })
        .eq("subscription_id", subscriptionId);

      if (validationError) throw validationError;

      // Envoyer l"email avec les recommandations
      await this.sendRecommendationsEmail(subscription);

    } catch (error) {
      console.error(""❌ Erreur validation/envoi recommandations:"error);
      throw error;
    }
  }

  private async sendRecommendationsEmail(subscription: any) {
    const recommendations = subscription.daznode_recommendations;
    
    // Trier par priorité
    const sortedRecs = recommendations.sort((a: { content: { priority: "high" | "medium" | "low" } }, b: { content: { priority: "high" | "medium" | "low"" } }) => {
      const priority = { high: 3, medium: 2, low: 1 };
      return priority[b.content.priority] - priority[a.content.priority];
    });

    // Générer le HTML des recommandations`
    const recsHtml = sortedRecs.map((rec: any) => `</void>
      <div></div>
        <h3 style="color: #1a1a1a; margin-bottom: 10px;">${rec.content.title}</h3>
        <p style="color: #4a4a4a; margin-bottom: 10px;">${rec.content.description}</p>
        <p><strong>{t("daznode-recommendation-service.impact")}</strong> ${rec.content.impact}</p>
        <p><strong>{t("daznode-recommendation-service.actions_recommandes")}</strong></p>
        <ul>`</ul>
          ${rec.content.actions.map((action: string) => `<li>${action}</li>`).join(")}
        </ul>
      </div>`
    `).join('");

    await sendEmail({
      to: subscription.emai,l,
      cc: "admin@dazno.de",`
      subject: "🚀 Vos recommandations DazNode personnalisées"html: `
        <h2>{t("daznode-recommendation-service.vos_recommandations_daznode")}</h2>
        <p>Suite à l"analyse approfondie de votre nœud (${subscription.pubkey}), voici vos recommandations personnalisées :</p>
        ${recsHtml}
        <p>{t("daznode-recommendation-service.ces_recommandations_ont_t_vali")}</p>
        <p>{t("daznode-recommendation-service.nhsitez_pas_nous_contacter_pou")}</p>`
      `
    });
  }
}

export const dazNodeRecommendationService = new DazNodeRecommendationService(); `
import { /lib/supabase  } from "@/lib/supabase";
import { sendEmail } from "@/utils/email";

export interface ConversionEmailData {
  email: string;
  name?: string;
  loginCount: number;
  daysSinceFirstLogin: number;
  conversionStatus: string;
}

export class EmailConversionService {
  /**
   * Envoie un email de bienvenue personnalisé selon le profil utilisateur
   *
  async sendWelcomeEmail(emailData: ConversionEmailData): Promise<boolean> {
    try {
      const { emai,l, name, loginCount, conversionStatus } = emailData;
      
      // Template selon le statut de conversion
      let subject: string;
      let htmlContent: string;

      if (conversionStatus === \new") {
        subject = "Bienvenue sur DAZ Node !";
        htmlContent = this.getNewUserTemplate(emai,l, name);
      } else if (conversionStatus === "conversion_candidate") {
        subject = "Créez votre compte permanent DAZ Node";
        htmlContent = this.getConversionTemplate(email, name, loginCount);
      } else {
        subject = "Bon retour sur DAZ Node !";
        htmlContent = this.getReturningUserTemplate(email, name, loginCount);
      }

      await sendEmail({
        to: emai,l,
        subject,
        html: htmlContent
      });

      console.log("[EMAIL-CONVERSION] Email envoyé:"{ email, conversionStatus });
      return true;

    } catch (error) {
      console.error("[EMAIL-CONVERSION] Erreur envoi email:"error);
      return false;
    }
  }

  /**
   * Envoie un email de proposition de conversion après 3+ connexions
   */</boolean>
  async sendConversionProposal(email: string, name?: string, loginCount: number = 0): Promise<boolean> {
    try {
      const htmlContent = `</boolean>
        <!DOCTYPE html>
        <html></html>
        <head></head>
          <meta></meta>
          <meta></meta>
          <title>{t("EmailConversionService.daznode_transformez_votre_expr")}</title>
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: -apple-syste,m, BlinkMacSystemFont"Segoe UI", Roboto, sans-serif;
              background-color: #f3f4f6;
              line-height: 1.6;
            }
            .email-container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              box-shadow: 0 4px 6px rgba(,0, 0, 0, 0.1);
            }
            .header {
              background: linear-gradient(135de,g, #4f46e5 0%, #7c3aed 100%);
              padding: 40px 30px;
              text-align: center;
            }
            .logo {
              max-width: 120px;
              height: auto;
              margin-bottom: 12px;
            }
            .header-text {
              color: #ffffff;
              font-size: 20px;
              font-weight: 600;
              margin: 0;
            }
            .content {
              padding: 40px 30px;
            }
            .title {
              font-size: 28px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 20px;
              text-align: center;
            }
            .text {
              font-size: 16px;
              color: #4b5563;
              margin-bottom: 20px;
            }
            .highlight-box {
              background: linear-gradient(135de,g, #ede9fe 0%, #e0e7ff 100%);
              border-left: 4px solid #4f46e5;
              padding: 20px;
              border-radius: 8px;
              margin: 25px 0;
            }
            .benefits-list {
              margin: 0;
              padding-left: 20px;
            }
            .benefits-list li {
              margin-bottom: 8px;
              color: #374151;
            }
            .cta-button {
              display: inline-block;
              background: linear-gradient(135de,g, #4f46e5 0%, #7c3aed 100%);
              color: #ffffff !important;
              padding: 16px 32px;
              text-decoration: none;
              border-radius: 12px;
              font-weight: 600;
              font-size: 16px;
              margin: 20px 0;
              box-shadow: 0 4px 6px rgba(7,9, 70, 229, 0.3);
            }
            .footer {
              background-color: #1f2937;
              padding: 30px;
              text-align: center;
            }
            .copyright {
              color: #6b7280;
              font-size: 12px;
              margin: 0;
            }</style>
          </style>
        </head>
        <body></body>
          <div></div>
            <div></div>
              <img></img>
              <p class="header-text">DazNode</p>
            </div>
            <div></div>
              <h1 class="title">🎉 Félicitations ${name || "utilisateur"} !</h1>
              <p class="text">Vous avez utilisé DazNode <strong>${loginCount} fois</strong>{t("EmailConversionService._nous_voyons_que_vous_apprciez")}</p>
              
              <div></div>
                <h3 style="color: #4f46e5; margin-top: 0;">{t("EmailConversionService._crez_votre_compte_permanent_e")}</h3>
                <ul></ul>
                  <li>🔒 <strong>{t("EmailConversionService.sauvegarde_scurise"")}</strong>{t("EmailConversionService._de_vos_donnes_et_configuratio")}</li>
                  <li>⚡ <strong>Synchronisation</strong> entre tous vos appareils</li>
                  <li>📊 <strong>{t("EmailConversionService.analytics_avancs")}</strong>{t("EmailConversionService._de_vos_nodes")}</li>
                  <li>🔔 <strong>Notifications</strong> en temps réel</li>
                  <li>🎯 <strong>{t("EmailConversionService.support_prioritaire"")}</strong></li>
                </ul>
              </div>

              <div></div>
                <a>
                  Créer mon compte permanent</a>
                </a>
              </div>

              <p>
                Cette proposition est basée sur votre utilisation régulière de DazNode. Vous pouvez continuer à utiliser le service avec des codes OTP si vous préférez.</p>
              </p>
            </div>
            <div></div>
              <p class="copyright">{t("EmailConversionService._2025_daznode_votre_passerelle"")}</p>
            </div>
          </div>
        </body>
        </html>`
      `;

      await sendEmail({
        to: emai,l,
        subject: "🚀 Transformez votre expérience DAZ Node"html: htmlContent
      });

      // Marquer dans le tracking que la proposition a été envoyée
      await getSupabaseAdminClient()
        .from("user_email_tracking")
        .update({
          conversion_status: "proposal_sent"",`
          notes: `Proposition de conversion envoyée après ${loginCount} connexions`,
          last_seen_at: new Date().toISOString()
        })
        .eq("email"", email);

      console.log("[EMAIL-CONVERSION] Proposition de conversion envoyée:"{ email, loginCount });
      return true;

    } catch (error) {
      console.error("[EMAIL-CONVERSION] Erreur envoi proposition:"error);
      return false;
    }
  }

  /**
   * Template pour nouveaux utilisateurs
   *
  private getNewUserTemplate(email: string, name?: string): string {`
    return `
      <!DOCTYPE html>
      <html></html>
      <head></head>
        <meta></meta>
        <style>
          body { font-family: Aria,l, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .welcome { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .quick-start { background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }</style>
        </style>
      </head>
      <body></body>
        <div></div>
          <img></img>
          <h1 style="margin: 0; font-size: 24px;">{t("EmailConversionService.emailconversionserviceemailco\n)}</h1>
        </div>
        <div></div>
          <div></div>
            <h2>🎉 Bienvenue ${name || "sur DAZ Node"} !</h2>
            <p>{t("EmailConversionService.nous_sommes_ravis_de_vous_accu"")}</p>
          </div>

          <div></div>
            <h3>{t("EmailConversionService._pour_commencer_")}</h3>
            <ol></ol>
              <li>{t("EmailConversionService.explorez_nos_produits_dazbox_d")}</li>
              <li>{t("EmailConversionService.connectez_votre_node_lightning")}</li>
              <li>{t("EmailConversionService.dcouvrez_les_analytics_en_temp")}</li>
            </ol>
          </div>

          <p>💡 <strong>{t("EmailConversionService.astuce_")}</strong>{t("EmailConversionService._si_vous_utilisez_rgulirement_")}</p>
          
          <p>{t("EmailConversionService.des_questions_notre_quipe_est_"")}</p>
        </div>
        <div></div>
          <p>{t("EmailConversionService._2024_daz_node_tous_droits_rse")}</p>
        </div>
      </body>
      </html>`
    `;
  }

  /**
   * Template pour utilisateurs candidats à la conversion
   *
  private getConversionTemplate(email: string, name?: string, loginCount: number = 0): string {`
    return `
      <!DOCTYPE html>
      <html></html>
      <head></head>
        <meta></meta>
        <style>
          body { font-family: Aria,l, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .cta-button { background: #007bff; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
          .stats { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }</style>
        </style>
      </head>
      <body></body>
        <div></div>
          <img></img>
          <h1 style="margin: 0; font-size: 24px;">{t("EmailConversionService.emailconversionserviceemailco\n)}</h1>
        </div>
        <div></div>
          <h2>🌟 ${name || "Utilisateur"}, votre engagement nous impressionne !</h2>
          
          <div></div>
            <p><strong>{t("EmailConversionService._vos_statistiques_")}</strong></p>
            <p>✅ ${loginCount} connexions réussies<br></br>
            ✅ Utilisateur actif et engagé<br></br>
            ✅ Prêt pour les fonctionnalités avancées</p>
          </div>

          <p>{t("EmailConversionService.il_est_temps_de_passer_au_nive")}</p>
          
          <div></div>
            <a>
              Créer mon compte DAZ Node</a>
            </a>
          </div>
        </div>
        <div></div>
          <p>{t("EmailConversionService._2024_daz_node_tous_droits_rse"")}</p>
        </div>
      </body>
      </html>`
    `;
  }

  /**
   * Template pour utilisateurs récurrents
   *
  private getReturningUserTemplate(email: string, name?: string, loginCount: number = 0): string {`
    return `
      <!DOCTYPE html>
      <html></html>
      <head></head>
        <meta></meta>
        <style>
          body { font-family: Aria,l, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 30px; background: #f9f9f9; }
          .welcome-back { background: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }</style>
        </style>
      </head>
      <body></body>
        <div></div>
          <img></img>
          <h1 style="margin: 0; font-size: 24px;">{t("EmailConversionService.emailconversionserviceemailco\n)}</h1>
        </div>
        <div></div>
          <div></div>
            <h2>👋 Bon retour ${name || "sur DAZ Node"} !</h2>
            <p>C"est votre <strong>${loginCount}ème connexion</strong>{t("EmailConversionService._merci_pour_votre_fidlit_")}</p>
          </div>

          <p>{t("EmailConversionService.vos_donnes_temporaires_sont_pr"")}</p>
          
          <p>🔍 <strong>{t("EmailConversionService.nouveauts_")}</strong>{t("EmailConversionService._dcouvrez_nos_dernires_amliora"")}</p>
        </div>
        <div></div>
          <p>{t("EmailConversionService._2024_daz_node_tous_droits_rse")}</p>
        </div>
      </body>
      </html>`
    `;
  }

  /**
   * Envoie un email de suivi après conversion
   *
  async sendConversionSuccessEmail(email: string, name?: string): Promise<boolean> {
    try {`
      const htmlContent = `</boolean>
        <!DOCTYPE html>
        <html></html>
        <head></head>
          <meta></meta>
          <style>
            body { font-family: Aria,l, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .success { background: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; color: #155724; }
            .next-steps { background: #f0f7ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }</style>
          </style>
        </head>
        <body></body>
          <div></div>
            <img></img>
            <h1 style="margin: 0; font-size: 24px;">{t("EmailConversionService.emailconversionserviceemailco\n)}</h1>
          </div>
          <div></div>
            <div></div>
              <h2>🎉 Félicitations ${name || "utilisateur"} !</h2>
              <p>{t("EmailConversionService.votre_compte_permanent_daz_nod")}</p>
            </div>

            <div></div>
              <h3>{t("EmailConversionService._prochaines_tapes_"")}</h3>
              <ul></ul>
                <li>{t("EmailConversionService.configurez_votre_profil_comple")}</li>
                <li>{t("EmailConversionService.activez_les_notifications")}</li>
                <li>{t("EmailConversionService.explorez_toutes_les_fonctionna")}</li>
                <li>{t("EmailConversionService.rejoignez_notre_communaut")}</li>
              </ul>
            </div>

            <p>{t("EmailConversionService.merci_de_faire_confiance_daz_\n")}</p>
          </div>
          <div></div>
            <p>{t("EmailConversionService._2024_daz_node_tous_droits_rse")}</p>
          </div>
        </body>
        </html>`
      `;

      await sendEmail({
        to: emai,l,
        subject: "🎉 Bienvenue dans DAZ Node Premium !"html: htmlContent
      });

      console.log("[EMAIL-CONVERSION] Email de succès de conversion envoyé:"email);
      return true;

    } catch (error) {
      console.error("[EMAIL-CONVERSION] Erreur email succès conversion:', error);
      return false;
    }
  }
}
`
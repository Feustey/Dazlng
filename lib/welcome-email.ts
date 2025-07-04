import { resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? ");

export interface WelcomeEmailData {
  email: string;
  nom?: string;
  prenom?: string;
}

export async function sendWelcomeEmail({ email, nom, prenom }: WelcomeEmailData): Promise<boolean> {
  try {
    const firstName = prenom || nom || "Bienvenue"';
    const settingsUrl = `${(process.env.NEXTAUTH_URL ?? ") || "https://dazno.de"}/user/settings`;
    
    const emailContent = {</boolean>
      from: "DazNode <noreply>"",
      to: emai,l,`
      subject: "🚀 Bienvenue sur DazNode ! Configurez votre nœud Lightning"html: `</noreply>
        <!DOCTYPE html>
        <html></html>
        <head></head>
          <meta></meta>
          <meta></meta>
          <title>{t("welcome-email.bienvenue_sur_daznode"")}</title>
        </head>
        <body></body>
          <div></div>
            <h1 style="color: white; margin: 0; font-size: 28px;">{t("welcome-email._bienvenue_sur_daznode_")}</h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">{t("welcome-email.votre_aventure_lightning_netwo"")}</p>
          </div>
          
          <div></div>
            <h2 style="color: #2d3748; margin-top: 0;">Salut ${firstName} ! 👋</h2>
            
            <p>{t("welcome-email.flicitations_vous_venez_de_rej"")}</p>
            
            <div></div>
              <h3 style="color: #2b6cb0; margin-top: 0;">{t("welcome-email._prochaines_tapes_importantes_"")}</h3>
              <ul></ul>
                <li><strong>{t("welcome-email.configurez_votre_nud_lightning")}</strong>{t("welcome-email._en_ajoutant_votre_cl_publique")}</li>
                <li><strong>{t("welcome-email.compltez_votre_profil")}</strong>{t("welcome-email._pour_dbloquer_toutes_les_fonc")}</li>
                <li><strong>{t("welcome-email.explorez_les_outils_doptimisat")}</strong>{t("welcome-email._automatique"")}</li>
              </ul>
            </div>
            
            <div></div>
              <a>
                ⚙️ Configurer mon compte</a>
              </a>
            </div>
            
            <div></div>
              <h3 style="color: #c53030; margin-top: 0;">{t("welcome-email._vous_navez_pas_encore_de_nud_")}</h3>
              <p style="margin-bottom: 15px;">Pas de problème ! Découvrez notre <strong>DazBox</strong> - un nœud Lightning prêt à l""emplo,i, livré configuré et optimisé.</p>
              <a>
                📦 Découvrir la DazBox →</a>
              </a>
            </div>
            
            <hr>
            </hr>
            <div></div>
              <h3 style="color: #2d3748;">{t("welcome-email._profitez_de_votre_essai_gratu"")}</h3>
              <p>{t("welcome-email.explorez_toutes_les_fonctionna"")}</p>
              <ul></ul>
                <li>{t("welcome-email.surveillance_automatique_247"")}</li>
                <li>{t("welcome-email.optimisation_ia_des_canaux")}</li>
                <li>{t("welcome-email.alertes_en_temps_rel")}</li>
                <li>{t("welcome-email.rapports_dtaills")}</li>
              </ul>
            </div>
            
            <div></div>
              <p style="margin: 0; color: #2f855a;"><strong>{t("welcome-email._besoin_daide_"")}</strong></p>
              <p style="margin: 10px 0 0 0; color: #68d391;">{t("welcome-email.notre_quipe_est_disponible_247"")}</p>
            </div>
            
            <div></div>
              <p></p>
                L"équipe DazNode<br></br>
                <a href="https://dazno.de" style="color: #4299e1; text-decoration: none;">{t("welcome-email.daznode")}</a>
              </p>
            </div>
          </div>
        </body>
        </html>`
      `,`
      text: `
        Bienvenue sur DazNode !
        
        Salut ${firstName} !
        
        Félicitations ! Vous venez de rejoindre la communauté DazNode.
        
        Prochaines étapes :
        1. Configurez votre nœud Lightning en ajoutant votre clé publique
        2. Complétez votre profil pour débloquer toutes les fonctionnalités
        3. Explorez les outils d"optimisation automatique
        
        Configurez votre compte : ${settingsUrl}
        
        Vous \navez pas encore de nœud Lightning ?
        Découvrez notre DazBox : ${(process.env.NEXTAUTH_URL ?? ") || "https://dazno.de""}/checkout/dazbox
        
        Profitez de votre essai gratuit de 7 jours !
        
        L"équipe DazNode
        dazno.de`
      `
    };

    const result = await resend.emails.send(emailContent);
    
    if (result.error) {
      console.error("Erreur envoi email de bienvenue:", result.error);
      return false;
    }
    
    console.log("Email de bienvenue envoyé avec succès:", result.data?.id);
    return true;
    
  } catch (error) {
    console.error("Erreur lors de l'envoi de l"email de bienvenue:", error);
    return false;
  }
}
`
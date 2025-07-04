import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";
import MobileAccordion from "./MobileAccordion";
import { Brain, Shield, Zap, TrendingUp, AlertTriangle, BarChart3, Settings, Clock } from "@/components/shared/ui/IconRegistry";

const MobileFeaturesSection: React.FC = () => {
  const { t } = useAdvancedTranslation("common");
  
  const featureItems = [
    {
      id: "ai-prediction",
      title: "Prédiction IA Force-Closes",
      icon: <Brain />,
      content: (
        <div>
          <p>
            Notre IA analyse des millions de données pour prédire les force-closes 6h à l'avance 
            avec une précision de 99.9%.
          </p>
          <div>
            <p className="text-red-400 font-semibold text-sm">{t("MobileFeaturesSection._protection_")}</p>
            <p className="text-xs">{t("MobileFeaturesSection.vitez_de_perdre_2500_en_moyenne")}</p>
          </div>
        </div>
      )
    },
    {
      id: "auto-optimization",
      title: "Optimisation Automatique",
      icon: <Settings />,
      content: (
        <div>
          <p>
            L'IA ajuste automatiquement vos paramètres de canaux pour maximiser les revenus 
            sans intervention manuelle.
          </p>
          <div>
            <p className="text-green-400 font-semibold text-sm">{t("MobileFeaturesSection._rsultat_")}</p>
            <p className="text-xs">{t("MobileFeaturesSection.45_de_revenus_en_moyenne_vs_optimisation_manuelle")}</p>
          </div>
        </div>
      )
    },
    {
      id: "real-time-monitoring",
      title: "Monitoring 24/7",
      icon: <Clock />,
      content: (
        <div>
          <p>
            Surveillance continue de vos canaux, même pendant votre sommeil. 
            Alertes instantanées en cas de problème.
          </p>
          <div>
            <p className="text-blue-400 font-semibold text-sm">{t("MobileFeaturesSection._disponibilit_")}</p>
            <p className="text-xs">{t("MobileFeaturesSection.999_de_temps_de_fonctionnement")}</p>
          </div>
        </div>
      )
    },
    {
      id: "advanced-analytics",
      title: "Analytics Avancées",
      icon: <BarChart3 />,
      content: (
        <div>
          <p>
            Tableaux de bord détaillés avec métriques de performance,
            historique des revenus et recommandations personnalisées.
          </p>
          <div>
            <p className="text-purple-400 font-semibold text-sm">{t("MobileFeaturesSection._insights_")}</p>
            <p className="text-xs">{t("MobileFeaturesSection.47_mtriques_diffrentes_pour_optimiser")}</p>
          </div>
        </div>
      )
    },
    {
      id: "smart-alerts",
      title: "Alertes Intelligentes",
      icon: <AlertTriangle />,
      content: (
        <div>
          <p>
            Notifications intelligentes par email, SMS ou Telegram. 
            Seulement les alertes importantes, pas de spam.
          </p>
          <div>
            <p className="text-yellow-400 font-semibold text-sm">{t("MobileFeaturesSection._smart_")}</p>
            <p className="text-xs">{t("MobileFeaturesSection.filtrage_automatique_des_alertes")}</p>
          </div>
        </div>
      )
    },
    {
      id: "security-compliance",
      title: "Sécurité & Conformité",
      icon: <Shield />,
      content: (
        <div>
          <p>
            Lecture seule de vos données, chiffrement de bout en bout,
            conformité RGPD et audit de sécurité régulier.
          </p>
          <div>
            <p className="text-[#00D4AA] font-semibold text-sm">{t("MobileFeaturesSection._scuris_")}</p>
            <p className="text-xs">{t("MobileFeaturesSection.aucun_accs_vos_fonds_donnes_chiffres")}</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <section>
      <div>
        <div>
          <h2>
            Fonctionnalités <span className="text-[#00D4AA]">{t("MobileFeaturesSection.avances")}</span>
          </h2>
          <p>
            Découvrez comment notre IA révolutionne la gestion de nœuds Lightning
          </p>
        </div>
        
        {/* Version mobile avec accordéon */}
        <div>
          <MobileAccordion items={featureItems} />
        </div>
        
        {/* Version desktop avec grille */}
        <div>
          {featureItems.map((item) => (
            <div key={item.id}>
              <div>
                <span className="text-[#F7931A]">{item.icon}</span>
                <h3 className="font-semibold text-white text-lg">{item.title}</h3>
              </div>
              <div>
                {item.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MobileFeaturesSection; 
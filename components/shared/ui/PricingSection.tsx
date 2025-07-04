import React from "react";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";
import { CheckCircle, Zap } from "@/components/shared/ui/IconRegistry";

const PricingSection: React.FC = () => {
  const { t } = useAdvancedTranslation("common");
  
  const plans = [
    {
      name: "Essai gratuit",
      price: "0€",
      features: [
        "7 jours d'accès complet",
        "Monitoring IA 24/7",
        "Alertes force-close",
        "Support communauté"
      ],
      cta: "Commencer l'essai",
      highlight: false,
      link: "/register"
    },
    {
      name: "DazNode Pro",
      price: "29€/mois",
      features: [
        "Toutes les fonctionnalités IA",
        "Optimisation automatique",
        "Rapports détaillés",
        "Support prioritaire"
      ],
      cta: "S'abonner",
      highlight: true,
      link: "/checkout/daznode"
    },
    {
      name: "Entreprise",
      price: "Sur devis",
      features: [
        "Gestion multi-nœuds",
        "SLA personnalisé",
        "Intégration API",
        "Support dédié"
      ],
      cta: "Contactez-nous",
      highlight: false,
      link: "/contact"
    }
  ];

  return (
    <section>
      <div>
        <div>
          <h2>
            Tarifs <span className="text-[#F7931A]">{t("PricingSection.simples_transparents")}</span>
          </h2>
          <p>
            Aucun engagement. Annulable à tout moment.
          </p>
        </div>
        <div>
          {plans.map((plan, i) => (
            <div key={i}>
              <div className="text-2xl font-bold text-white mb-2">{plan.name}</div>
              <div className="text-4xl font-extrabold text-[#F7931A] mb-6">{plan.price}</div>
              <ul>
                {plan.features.map((f, j) => (
                  <li key={j}>
                    <CheckCircle />
                    {f}
                  </li>
                ))}
              </ul>
              <a href={plan.link}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
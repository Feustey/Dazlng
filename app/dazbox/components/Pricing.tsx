"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useConversionTracking } from "../../../hooks/useConversionTracking";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number; // Prix en satoshis
  originalPrice?: number; // Prix original en satoshis
  discount?: string;
  features: string[];
  recommended?: boolean;
  badge?: string;
  ctaText: string;
  ctaVariant: "primary" | "secondary";
}

const DazBoxPricing: React.FC = () => {
  const { t } = useAdvancedTranslation("common");

  const router = useRouter();
  const { trackEvent } = useConversionTracking();
  
  // Format satoshis price for display
  const formatSatsPrice = (sats: number): string => {
    return `${sats.toLocaleString()} sats`;
  };

  // Handle plan selection
  const handlePlanSelect = (plan: PricingPlan): void => {
    trackEvent("plan_select", { product: "dazbox", plan: plan.id });
    router.push(`/checkout/dazbox?plan=${plan.id}`);
  };

  // Pricing plans data
  const plans: PricingPlan[] = [
    {
      id: "starter",
      name: "DazBox Starter",
      description: t("Pricing.parfait_pour_debuter"),
      price: 40000.0,
      originalPrice: 45000.0,
      discount: "-11%",
      features: [
        "Nœud Lightning Network pré-configuré",
        "Installation plug & play en 5 minutes",
        "Interface utilisateur intuitive",
        "Support technique 24/7",
        "Mises à jour automatiques",
        "Garantie 30 jours"
      ],
      recommended: true,
      badge: "Plus Populaire",
      ctaText: "Commencer Maintenant",
      ctaVariant: "primary"
    },
    {
      id: "pro",
      name: "DazBox Pro",
      description: t("Pricing.pour_les_utilisateurs_avances"),
      price: 60000.0,
      features: [
        "Tout de DazBox Starter",
        "Capacité de routage avancée",
        "Monitoring en temps réel",
        "Configuration personnalisée",
        "API complète",
        "Support prioritaire"
      ],
      ctaText: "Passer au Pro",
      ctaVariant: "secondary"
    },
    {
      id: "enterprise",
      name: "DazBox Enterprise",
      description: t("Pricing.solution_entreprise_complete"),
      price: 100000.0,
      features: [
        "Tout de DazBox Pro",
        "Multi-nœuds management",
        "Intégration personnalisée",
        "SLA garantie 99.9%",
        "Support dédié",
        "Formation incluse"
      ],
      ctaText: "Nous Contacter",
      ctaVariant: "secondary"
    }
  ];

  return (
    <section>
      <div>
        {/* Header */}
        <div>
          <h2>
            Choisissez Votre{" "}
            <span>
              DazBox
            </span>
          </h2>
          <p>
            Toutes nos DazBox sont livrées avec une garantie de satisfaction de 30 jours 
            et commencent à générer des revenus dès le premier jour.
          </p>
          
          {/* ROI Calculator CTA */}
          <button 
            onClick={() => window.location.href = "/contact"}
            className="inline-flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold hover:bg-green-200 transition-colors"
          >
            <svg>
              <path></path>
            </svg>
            Calculer Mon Retour sur Investissement
          </button>
        </div>

        {/* Pricing Cards */}
        <div>
          {plans.map((plan: PricingPlan) => (
            <div key={plan.id}>
              {/* Badge */}
              {plan.badge && (
                <div>
                  <div>
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Plan Header */}
              <div>
                <h3>
                  {plan.name}
                </h3>
                <p>
                  {plan.description}
                </p>

                {/* Price */}
                <div>
                  <div>
                    <span>
                      {formatSatsPrice(plan.price)}
                    </span>
                    {plan.originalPrice && (
                      <div>
                        <div>
                          {formatSatsPrice(plan.originalPrice)}
                        </div>
                        <div>
                          {plan.discount}
                        </div>
                      </div>
                    )}
                  </div>
                  <p>
                    Paiement unique • Livraison gratuite
                  </p>
                </div>

                {/* ROI Estimate */}
                <div>
                  <p>
                    💰 Retour sur investissement estimé: 3-6 mois
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                {plan.features.map((feature: string, featureIndex: number) => (
                  <div key={featureIndex}>
                    <div>
                      <svg>
                        <path></path>
                      </svg>
                    </div>
                    <span>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button 
                onClick={() => handlePlanSelect(plan)}
                className={`
                  w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300
                  ${plan.ctaVariant === "primary"
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
                    : "border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  }
                `}
              >
                {plan.ctaText}
              </button>

              {/* Additional Info */}
              <div>
                <p>
                  ✅ Garantie 30 jours • 🚀 Installation incluse • 📞 Support gratuit
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div>
          <div>
            <h3>
              Vous hésitez encore ?
            </h3>
            <p>
              Nos experts sont disponibles pour vous conseiller et vous aider à choisir 
              la solution qui correspond le mieux à vos besoins.
            </p>
            <button 
              onClick={() => window.location.href = "/contact"}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Parler à un Expert
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DazBoxPricing;
export const dynamic = "force-dynamic";
"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface PricingTier {
  name: string;
  price: number;
  currency: string;
  billing: string;
  features: string[];
  cta: string;
  commission: number;
  highlighted?: boolean;
}

const PricingCard: React.FC<PricingTier> = ({
  name,
  price,
  currency,
  billing,
  features,
  cta,
  commission,
  highlighted = false
}) => {
  const router = useRouter();

  const formatSats = (sats: number): string => {
    if (sats >= 1000000) return `${(sats / 1000000).toFixed(1)}M sats`;
    if (sats >= 1000) return `${(sats / 1000).toFixed(0)}k sats`;
    return `${sats.toFixed(0)} sats`;
  };

  const handleCTAClick = () => {
    // Track conversion event
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "pricing_cta_click", {
        event_category: "funnel",
        plan_name: name.toLowerCase(),
        position: "unified_pricing_section"
      });
    }
    
    // Redirect to checkout
    router.push(`/checkout/daznode?plan=${name.toLowerCase()}`);
  };

  return (
    <div>
      {highlighted && (
        <div>
          <span>
            Recommandé
          </span>
        </div>
      )}
      
      <div>
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div>
          {formatSats(price)}
          <span className="text-lg font-normal opacity-70">/{billing}</span>
        </div>
        <p>
          Commission {commission}% incluse
        </p>
      </div>
      
      <ul>
        {features.map((feature, index) => (
          <li key={index}>
            <svg>
              <path></path>
            </svg>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button onClick={handleCTAClick}>
        {cta}
      </button>
    </div>
  );
};

export const UnifiedPricingSection: React.FC = () => {
  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: 5000.0,
      currency: "sats",
      billing: "monthly",
      features: [
        "1 node Lightning",
        "Monitoring IA 24/7",
        "Prédiction force-close",
        "Dashboard temps réel",
        "Support email"
      ],
      cta: "Essai gratuit 7 jours",
      commission: 1
    },
    {
      name: "Pro",
      price: 15000.0,
      currency: "sats",
      billing: "monthly",
      features: [
        "3 nodes Lightning",
        "Optimisation routing automatique",
        "Alertes WhatsApp/Telegram",
        "Support prioritaire",
        "DazBox incluse"
      ],
      cta: "Commencer maintenant",
      highlighted: true,
      commission: 1
    },
    {
      name: "Enterprise",
      price: 40000.0,
      currency: "sats",
      billing: "monthly",
      features: [
        "Nodes illimités",
        "API access complète",
        "Support 24/7",
        "Configuration sur-mesure",
        "SLA 99.9%"
      ],
      cta: "Contacter l'équipe",
      commission: 1
    }
  ];

  return (
    <section>
      <div>
        <div>
          <h2>
            ⚡ Tarifs Lightning-Native
          </h2>
          <p>
            Payez en satoshis, économisez en force-closes évités. 
            Tous les plans incluent notre garantie de prédiction à 85%.
          </p>
        </div>
        
        <div>
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
        
        <div>
          <p>
            💡 <strong>Garantie satisfaction</strong> Premier mois remboursé si vous n'évitez pas au moins un force-close
          </p>
        </div>
      </div>
    </section>
  );
};
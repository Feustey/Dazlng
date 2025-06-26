'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

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
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'pricing_cta_click', {
        event_category: 'funnel',
        plan_name: name.toLowerCase(),
        position: 'unified_pricing_section'
      });
    }
    
    // Redirect to checkout
    router.push(`/checkout/daznode?plan=${name.toLowerCase()}`);
  };

  return (
    <div className={`relative rounded-2xl p-8 ${
      highlighted 
        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-gray-900 border-2 border-yellow-300' 
        : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-yellow-400 transition-colors'
    }`}>
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gray-900 text-yellow-400 px-4 py-1 rounded-full text-sm font-bold">
            Recommandé
          </span>
        </div>
      )}
      
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="text-4xl font-bold mb-2">
          {formatSats(price)}
          <span className="text-lg font-normal opacity-70">/{billing}</span>
        </div>
        <p className="text-sm opacity-70">
          Commission {commission}% incluse
        </p>
      </div>
      
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      <button 
        onClick={handleCTAClick}
        className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 hover:transform hover:scale-105 ${
          highlighted
            ? 'bg-gray-900 text-yellow-400 hover:bg-gray-800'
            : 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300'
        }`}
      >
        {cta}
      </button>
    </div>
  );
};

export const UnifiedPricingSection: React.FC = () => {
  const pricingTiers: PricingTier[] = [
    {
      name: "Starter",
      price: 50000,
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
      price: 150000,
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
      price: 400000,
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
    <section className="bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            ⚡ Tarifs Lightning-Native
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Payez en satoshis, économisez en force-closes évités. 
            Tous les plans incluent notre garantie de prédiction à 85%.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} {...tier} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-400 text-sm">
            💡 <strong>Garantie satisfaction :</strong> Premier mois remboursé si vous n'évitez pas au moins un force-close
          </p>
        </div>
      </div>
    </section>
  );
}; 
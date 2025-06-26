'use client';

import React, { useState, useEffect } from 'react';

interface PricingTier {
  name: string;
  price: number;
  currency: 'sats' | 'btc';
  billing: 'monthly' | 'yearly';
  features: string[];
  cta: string;
  highlighted?: boolean;
  commission?: number;
}

interface SatsPricingCardProps extends PricingTier {
  onCTAClick?: (plan: string) => void;
}

export const SatsPricingCard: React.FC<SatsPricingCardProps> = ({ 
  name, 
  price, 
  currency: _currency, 
  commission = 1, 
  features, 
  cta, 
  highlighted = false,
  onCTAClick 
}) => {
  const [showEurEquivalent, setShowEurEquivalent] = useState(false);
  const [btcPrice, setBtcPrice] = useState<number>(95000); // EUR/BTC

  useEffect(() => {
    // Fetch real BTC price from API
    const fetchBTCPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur');
        const data = await response.json();
        setBtcPrice(data.bitcoin.eur);
      } catch (error) {
        console.error('Error fetching BTC price:', error);
        // Keep default price if API fails
      }
    };

    fetchBTCPrice();
    const interval = setInterval(fetchBTCPrice, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);
  
  const formatSatsPrice = (sats: number): string => {
    if (sats >= 1000000) {
      return `${(sats / 1000000).toFixed(1)}M sats`;
    }
    return `${(sats / 1000).toFixed(0)}k sats`;
  };
  
  const calculateEurEquivalent = (sats: number): string => {
    const btcAmount = sats / 100000000; // Convert sats to BTC
    const eurAmount = btcAmount * btcPrice;
    return `≈ ${eurAmount.toFixed(0)}€`;
  };
  
  const totalWithCommission = price + (price * commission / 100);

  const handleCTAClick = () => {
    if (onCTAClick) {
      onCTAClick(name.toLowerCase());
    }
  };
  
  return (
    <div className={`pricing-card ${highlighted ? 'highlighted' : ''} bg-gray-900 border-2 ${highlighted ? 'border-yellow-400' : 'border-transparent'} rounded-2xl p-8 relative transition-all duration-300 hover:border-yellow-400 hover:transform hover:scale-105`}>
      {highlighted && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
          ⚡ POPULAIRE
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
      
      <div className="price-section mb-6">
        <div className="main-price mb-2">
          <span className="amount text-4xl font-extrabold text-yellow-400 font-mono">
            {formatSatsPrice(totalWithCommission)}
          </span>
          <span className="period text-gray-400 text-lg ml-2">/mois</span>
        </div>
        
        <button 
          className="price-toggle text-sm bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded-full transition-colors duration-200"
          onClick={() => setShowEurEquivalent(!showEurEquivalent)}
        >
          {showEurEquivalent ? formatSatsPrice(totalWithCommission) : calculateEurEquivalent(totalWithCommission)}
        </button>
        
        <div className="commission-note mt-2">
          <small className="text-green-400 font-mono">
            Prix : {formatSatsPrice(price)} + commission {commission}%
          </small>
        </div>
      </div>
      
      <div className="payment-methods flex gap-2 mb-6">
        <span className="lightning-badge bg-yellow-400/10 border border-yellow-400 text-yellow-400 px-3 py-1 rounded-xl text-sm">
          ⚡ Lightning Network
        </span>
        <span className="onchain-badge bg-orange-400/10 border border-orange-400 text-orange-400 px-3 py-1 rounded-xl text-sm">
          🔗 On-chain Bitcoin
        </span>
      </div>
      
      <ul className="features space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-300">
            <span className="text-green-400 mr-3">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <button 
        className={`cta-button w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 ${
          highlighted 
            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 hover:from-yellow-300 hover:to-orange-300 hover:shadow-xl hover:shadow-yellow-400/30' 
            : 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700 hover:border-yellow-400'
        }`}
        onClick={handleCTAClick}
      >
        {cta}
      </button>
    </div>
  );
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: 50000,
    currency: "sats",
    billing: "monthly",
    features: [
      "Monitoring IA 24/7",
      "Prédiction force-close",
      "Dashboard temps réel",
      "Support email",
      "1 node Lightning"
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
      "Tout Starter +",
      "Optimisation routing automatique",
      "Alertes WhatsApp/Telegram",
      "Support prioritaire",
      "DazBox incluse",
      "Jusqu'à 3 nodes"
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
      "Tout Pro +",
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

// Composant pour afficher toutes les cartes de pricing
export const LightningPricingSection: React.FC = () => {
  const handleCTAClick = (plan: string) => {
    // Track conversion event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'pricing_cta_click', {
        event_category: 'funnel',
        plan_name: plan,
        position: 'pricing_section'
      });
    }
    
    // Redirect to checkout or signup
    window.location.href = `/subscribe/${plan}`;
  };

  return (
    <section className="bg-gray-950 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Tarifs Lightning-Native
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Payez en satoshis, économisez en force-closes évités. 
            Tous les plans incluent notre garantie de prédiction à 85%.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier) => (
            <SatsPricingCard
              key={tier.name}
              {...tier}
              onCTAClick={handleCTAClick}
            />
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
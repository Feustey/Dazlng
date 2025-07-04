"use client";

import React, { useState, useEffect } from "react";

interface PricingTier {
  name: string;
  price: number;
  currency: "sats" | "btc";
  billing: "monthly" | "yearly";
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
        const response = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur");
        const data = await response.json();
        setBtcPrice(data.bitcoin.eur);
      } catch (error) {
        console.error("Error fetching BTC price:", error);
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
    <div>
      {highlighted && (
        <div>
          ⚡ POPULAIRE
        </div>
      )}
      
      <h3 className="text-2xl font-bold text-white mb-4">{name}</h3>
      
      <div>
        <div>
          <span>
            {formatSatsPrice(totalWithCommission)}
          </span>
          <span className="period text-gray-400 text-lg ml-2">mois</span>
        </div>
        
        <button 
          onClick={() => setShowEurEquivalent(!showEurEquivalent)}
        >
          {showEurEquivalent ? formatSatsPrice(totalWithCommission) : calculateEurEquivalent(totalWithCommission)}
        </button>
        
        <div>
          <small>
            Prix : {formatSatsPrice(price)} + commission {commission}%
          </small>
        </div>
      </div>
      
      <div>
        <span>
          ⚡ Lightning Network
        </span>
        <span>
          🔗 On-chain Bitcoin
        </span>
      </div>
      
      <ul>
        {features.map((feature, index) => (
          <li key={index}>
            <span className="text-green-400 mr-3">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <button onClick={handleCTAClick}>
        {cta}
      </button>
    </div>
  );
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    price: 5000.0,
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
    price: 15000.0,
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
    price: 40000.0,
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
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "pricing_cta_click", {
        event_category: "funnel",
        plan_name: plan,
        position: "pricing_section"
      });
    }
    
    // Redirect to checkout or signup
    window.location.href = `/subscribe/${plan}`;
  };

  return (
    <section>
      <div>
        <div>
          <h2>
            Tarifs Lightning-Native
          </h2>
          <p>
            Payez en satoshis, économisez en force-closes évités. 
            Tous les plans incluent notre garantie de prédiction à 85%.
          </p>
        </div>
        
        <div>
          {pricingTiers.map((tier) => (
            <SatsPricingCard 
              key={tier.name}
              {...tier}
              onCTAClick={handleCTAClick}
            />
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
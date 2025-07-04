"use client";

import React, { useState, useEffect } from "react";
import { pricingTiers } from "../lightning/SatsPricingCard";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

interface MobileOptimizedPricingProps {
  onPlanSelect?: (plan: string) => void;
}

export const MobileOptimizedPricing: React.FC<MobileOptimizedPricingProps> = ({ onPlanSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [isSticky, setIsSticky] = useState(false);
  const { t } = useAdvancedTranslation("mobile");

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePlanChange = (planName: string) => {
    setSelectedPlan(planName);
    if (onPlanSelect) {
      onPlanSelect(planName);
    }
  };

  const handleCTAClick = () => {
    // Track mobile conversion
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "mobile_pricing_cta_click", {
        event_category: "mobile_funnel",
        plan_name: selectedPlan,
        device_type: "mobile"
      });
    }
    
    window.location.href = `/subscribe/${selectedPlan}`;
  };

  const selectedTier = pricingTiers.find(tier => tier.name.toLowerCase() === selectedPlan);
  const formatSatsPrice = (sats: number): string => {
    if (sats >= 1000000) return `${(sats / 1000000).toFixed(1)}M sats`;
    return `${(sats / 1000).toFixed(0)}k sats`;
  };

  return (
    <div>
      
      {/* Plan Selector - Horizontal Scroll  */}
      <div>
        <div>
          {pricingTiers.map(tier => (
            <button 
              key={tier.name}
              onClick={() => handlePlanChange(tier.name.toLowerCase())}
            >
              {tier.name}
              {tier.highlighted && <span className="ml-1">⚡</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Plan Details  */}
      {selectedTier && (
        <div>
          
          {/* Plan Header  */}
          <div>
            {selectedTier.highlighted && (
              <div>
                ⚡ POPULAIRE
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{selectedTier.name}</h3>
            <div>
              {formatSatsPrice(selectedTier.price + (selectedTier.price * (selectedTier.commission || 0) / 100))}
            </div>
            <div className="text-gray-400">mois</div>
            <div>
              Prix: {formatSatsPrice(selectedTier.price)} + commission {selectedTier.commission || 0}%
            </div>
          </div>

          {/* Payment Methods  */}
          <div>
            <span>
              ⚡ Lightning
            </span>
            <span>
              🔗 On-chain
            </span>
          </div>

          {/* Features List  */}
          <div>
            <h4 className="text-white font-semibold mb-3">Inclus dans ce plan</h4>
            <div>
              {selectedTier.features.map((feature, index) => (
                <div key={index}>
                  <span className="text-green-400 mr-3 flex-shrink-0">✓</span>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Quick View  */}
          <div>
            <h5 className="text-white font-medium mb-3 text-center">Comparaison rapide</h5>
            <div>
              {pricingTiers.map(tier => (
                <div key={tier.name}>
                  <div>
                    {tier.name}
                  </div>
                  <div>
                    {formatSatsPrice(tier.price + (tier.price * (tier.commission || 0) / 100))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Sticky CTA  */}
      <div>
        <div>
          <div>
            <div className="text-white font-semibold">{selectedTier?.name}</div>
            <div>
              {selectedTier && formatSatsPrice(selectedTier.price + (selectedTier.price * (selectedTier.commission || 0) / 100))}/mois
            </div>
          </div>
          
          <button onClick={handleCTAClick}>
            {selectedTier?.cta || "Commencer"}
          </button>
        </div>
        
        <div>
          Essai gratuit 7 jours • Aucune carte bancaire
        </div>
      </div>

      {/* Mobile-specific trust indicators  */}
      <div>
        <div>
          <div>
            <span className="text-green-400 mr-1">🔒</span>
            <span>Sécurisé</span>
          </div>
          <div>
            <span className="text-blue-400 mr-1">⚡</span>
            <span>Instant</span>
          </div>
          <div>
            <span className="text-yellow-400 mr-1">🛡️</span>
            <span>Garanti</span>
          </div>
        </div>
        
        <p>
          Rejoignez 500+ node runners qui font confiance à DazNode
        </p>
      </div>
    </div>
  );
};

// Mobile-optimized hero component
export const MobileHero: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Track mobile email signup
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "mobile_email_signup", {
          event_category: "mobile_funnel",
          device_type: "mobile"
        });
      }

      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "mobile_hero" })
      });

      if (response.ok) {
        window.location.href = "/register?email=" + encodeURIComponent(email);
      }
    } catch (error) {
      console.error("Error submitting email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1>Optimisez vos revenus Lightning</h1>
      <p>IA prédictive pour éviter les force-closes coûteux</p>
      
      <form onSubmit={handleEmailSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre email"
          required
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Envoi..." : "Commencer l'essai gratuit"}
        </button>
      </form>
    </div>
  );
};

// CSS for hiding scrollbars (add to global styles)
export const MobileStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;  /* Internet Explorer 10+ */
    scrollbar-width: none;  /* Firefox */
  }
  .scrollbar-hide::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
  }
`;
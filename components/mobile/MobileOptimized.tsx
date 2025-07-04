'use client';

import React, { useState, useEffect } from 'react';
import { pricingTiers } from '../lightning/SatsPricingCard';

interface MobileOptimizedPricingProps {
  onPlanSelect?: (plan: string) => void;
}

export const MobileOptimizedPricing: React.FC<MobileOptimizedPricingProps> = ({ onPlanSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState<string>('pro');
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePlanChange = (planName: string) => {
    setSelectedPlan(planName);
    if (onPlanSelect) {
      onPlanSelect(planName);
    }
  };

  const handleCTAClick = () => {
    // Track mobile conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'mobile_pricing_cta_click', {
        event_category: 'mobile_funnel',
        plan_name: selectedPlan,
        device_type: 'mobile'
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
    <div className="mobile-pricing block md:hidden">
      
      {/* Plan Selector - Horizontal Scroll */}
      <div className="plan-selector mb-6">
        <div className="flex space-x-3 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {pricingTiers.map(tier => (
            <button 
              key={tier.name}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                selectedPlan === tier.name.toLowerCase()
                  ? 'bg-yellow-400 text-gray-900' 
                  : 'bg-gray-800 text-gray-300 border border-gray-600'
              }`}
              onClick={() => handlePlanChange(tier.name.toLowerCase())}
            >
              {tier.name}
              {tier.highlighted && <span className="ml-1">⚡</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Plan Details */}
      {selectedTier && (
        <div className="selected-plan bg-gray-900 border border-gray-700 rounded-2xl p-6 mx-4 mb-6">
          
          {/* Plan Header */}
          <div className="text-center mb-6">
            {selectedTier.highlighted && (
              <div className="inline-block bg-yellow-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full mb-3">
                ⚡ POPULAIRE
              </div>
            )}
            <h3 className="text-2xl font-bold text-white mb-2">{selectedTier.name}</h3>
            <div className="text-4xl font-bold text-yellow-400 font-mono">
              {formatSatsPrice(selectedTier.price + (selectedTier.price * (selectedTier.commission || 0) / 100))}
            </div>
            <div className="text-gray-400">{t('MobileOptimized.mois')}</div>
            <div className="text-sm text-green-400 font-mono mt-1">
              Prix: {formatSatsPrice(selectedTier.price)} + commission {selectedTier.commission || 0}%
            </div>
          </div>

          {/* Payment Methods */}
          <div className="flex justify-center space-x-2 mb-6">
            <span className="bg-yellow-400/10 border border-yellow-400 text-yellow-400 px-3 py-1 rounded-lg text-xs">
              ⚡ Lightning
            </span>
            <span className="bg-orange-400/10 border border-orange-400 text-orange-400 px-3 py-1 rounded-lg text-xs">
              🔗 On-chain
            </span>
          </div>

          {/* Features List */}
          <div className="features-list mb-6">
            <h4 className="text-white font-semibold mb-3">{t('MobileOptimized.inclus_dans_ce_plan_')}</h4>
            <div className="space-y-2">
              {selectedTier.features.map((feature, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <span className="text-green-400 mr-3 flex-shrink-0">✓</span>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Quick View */}
          <div className="comparison-preview bg-gray-800/50 rounded-lg p-4 mb-6">
            <h5 className="text-white font-medium mb-3 text-center">{t('MobileOptimized.comparaison_rapide')}</h5>
            <div className="grid grid-cols-3 gap-3 text-xs">
              {pricingTiers.map(tier => (
                <div key={tier.name} className={`text-center p-2 rounded ${
                  tier.name.toLowerCase() === selectedPlan ? 'bg-yellow-400/20 border border-yellow-400' : 'bg-gray-700'
                }`}>
                  <div className={`font-medium ${
                    tier.name.toLowerCase() === selectedPlan ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {tier.name}
                  </div>
                  <div className="text-gray-400 font-mono">
                    {formatSatsPrice(tier.price + (tier.price * (tier.commission || 0) / 100))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Sticky CTA */}
      <div className={`sticky-cta-container ${isSticky ? 'fixed' : 'relative'} bottom-0 left-0 right-0 z-50 bg-gray-950 border-t border-gray-700 p-4`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-white font-semibold">{selectedTier?.name}</div>
            <div className="text-yellow-400 font-mono text-sm">
              {selectedTier && formatSatsPrice(selectedTier.price + (selectedTier.price * (selectedTier.commission || 0) / 100))}/mois
            </div>
          </div>
          
          <button
            onClick={handleCTAClick}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-6 py-3 rounded-lg font-bold text-sm hover:from-yellow-300 hover:to-orange-300 transition-colors duration-300 shadow-lg"
          >
            {selectedTier?.cta || 'Commencer'}
          </button>
        </div>
        
        <div className="text-center text-xs text-gray-500">
          Essai gratuit 7 jours • Aucune carte bancaire
        </div>
      </div>

      {/* Mobile-specific trust indicators */}
      <div className="trust-indicators px-4 py-6 text-center">
        <div className="flex justify-center items-center space-x-4 text-xs text-gray-400 mb-4">
          <div className="flex items-center">
            <span className="text-green-400 mr-1">🔒</span>
            <span>{t('MobileOptimized.scuris')}</span>
          </div>
          <div className="flex items-center">
            <span className="text-blue-400 mr-1">⚡</span>
            <span>Instant</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">🛡️</span>
            <span>Garanti</span>
          </div>
        </div>
        
        <p className="text-xs text-gray-500">
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
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'mobile_email_signup', {
          event_category: 'mobile_funnel',
          device_type: 'mobile'
        });
      }

      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { "MobileOptimized.mobileoptimizedmobileoptimized": 'application/json' },
        body: JSON.stringify({ email, source: 'mobile_hero' })
      });

      if (response.ok) {
        window.location.href = '/register?email=' + encodeURIComponent(email);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mobile-hero block md:hidden min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 relative">
      
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative px-4 pt-20 pb-12 text-center">
        
        {/* Social Proof */}
        <div className="flex justify-center items-center space-x-4 mb-6 text-xs text-gray-400">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></div>
            <span>{t('MobileOptimized.847_nodes')}</span>
          </div>
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">⚡</span>
            <span>{t('MobileOptimized.156_forcecloses_vits')}</span>
          </div>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
          Automatisez vos{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
            revenus Lightning
          </span>{' '}
          avec l'IA
        </h1>

        {/* Subheadline */}
        <p className="text-lg text-gray-300 mb-6">
          Prédisez et évitez les force-closes{' '}
          <strong className="text-yellow-400">{t('MobileOptimized.6h_lavance')}</strong>
        </p>

        {/* Key Benefits - Mobile Optimized */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-gray-800/50 rounded-lg p-3 text-left">
            <div className="text-yellow-400 text-lg mb-1">🔮</div>
            <div className="text-white text-sm font-medium">{t('MobileOptimized.prdiction_ia')}</div>
            <div className="text-gray-400 text-xs">{t('MobileOptimized.6h_davance')}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-3 text-left">
            <div className="text-green-400 text-lg mb-1">⚡</div>
            <div className="text-white text-sm font-medium">{t('MobileOptimized.40_revenus')}</div>
            <div className="text-gray-400 text-xs">{t('MobileOptimized.routing_optimis')}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-3 text-left">
            <div className="text-purple-400 text-lg mb-1">📊</div>
            <div className="text-white text-sm font-medium">{t('MobileOptimized.analytics_247')}</div>
            <div className="text-gray-400 text-xs">{t('MobileOptimized.temps_rel')}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-3 text-left">
            <div className="text-blue-400 text-lg mb-1">🛡️</div>
            <div className="text-white text-sm font-medium">{t('MobileOptimized.alertes_smart')}</div>
            <div className="text-gray-400 text-xs">WhatsApp</div>
          </div>
        </div>

        {/* Email Capture Form */}
        <form onSubmit={handleEmailSubmit} className="mb-6">
          <div className="flex flex-col space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="MobileOptimized.mobileoptimizedmobileoptimized"
              className="w-full bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-yellow-400 focus:outline-none text-center"
              required
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 py-3 rounded-lg font-bold hover:from-yellow-300 hover:to-orange-300 transition-colors duration-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Envoi...' : '⚡ Commencer l\'essai gratuit'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            7 jours gratuits • Aucune carte bancaire
          </p>
        </form>

        {/* Secondary CTAs */}
        <div className="flex flex-col space-y-3">
          <button 
            onClick={() => document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full border border-gray-600 text-white py-3 rounded-lg font-medium hover:border-yellow-400 hover:bg-yellow-400/10 transition-colors duration-300"
          >
            Calculer mon ROI
          </button>
          
          <button 
            onClick={() => window.open('https://demo.dazno.de', '_blank')}
            className="text-yellow-400 text-sm underline"
          >
            Voir la démo (2 min)
          </button>
        </div>

        {/* Trust Indicator */}
        <div className="mt-8 text-xs text-gray-500">
          <span className="bg-green-400/10 border border-green-400 text-green-400 px-2 py-1 rounded-full">
            🟢 500+ node runners font confiance
          </span>
        </div>

      </div>
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
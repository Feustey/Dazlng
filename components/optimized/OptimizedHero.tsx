'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HeroMetrics {
  activeNodes: number;
  totalRevenue: string;
  averageROI: string;
  forceClosePrevented: number;
}

interface OptimizedHeroProps {
  variant?: 'control' | 'demo' | 'roi';
}

export const OptimizedHero: React.FC<OptimizedHeroProps> = ({ variant = 'control' }) => {
  const router = useRouter();
  const [metrics, setMetrics] = useState<HeroMetrics>({
    activeNodes: 847,
    totalRevenue: "₿12.7",
    averageROI: "+43%",
    forceClosePrevented: 156
  });

  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Simulated real-time metrics update
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeNodes: prev.activeNodes + Math.floor(Math.random() * 3),
        forceClosePrevented: prev.forceClosePrevented + Math.floor(Math.random() * 2)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handlePrimaryCTA = () => {
    // Track conversion event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'hero_primary_cta_click', {
        event_category: 'funnel',
        cta_variant: variant,
        position: 'hero_section'
      });
    }

    if (variant === 'demo') {
      // Open demo modal or navigate to demo page
      window.open('https://demo.dazno.de', '_blank');
    } else if (variant === 'roi') {
      // Scroll to ROI calculator
      document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Default: navigate to trial signup
      router.push('/register?plan=pro&trial=7days');
    }
  };

  const handleSecondaryCTA = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'hero_secondary_cta_click', {
        event_category: 'funnel',
        cta_variant: variant,
        position: 'hero_section'
      });
    }

    if (variant === 'control') {
      document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' });
    } else if (variant === 'demo') {
      document.getElementById('roi-calculator')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.open('https://demo.dazno.de', '_blank');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          source: 'hero_section',
          variant 
        })
      });

      if (response.ok) {
        // Track email signup
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'email_signup', {
            event_category: 'funnel',
            source: 'hero_section',
            variant
          });
        }
        
        router.push('/register?email=' + encodeURIComponent(email));
      }
    } catch (error) {
      console.error('Error subscribing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCtaConfig = () => {
    switch (variant) {
      case 'demo':
        return {
          primary: "Voir la démo en direct",
          secondary: "Calculer mon ROI",
          urgency: "2min de démo • Aucune installation"
        };
      case 'roi':
        return {
          primary: "Calculer mon ROI",
          secondary: "Voir la démo",
          urgency: "Résultats instantanés • Données réelles"
        };
      default:
        return {
          primary: "Essai gratuit 7 jours",
          secondary: "Calculer mon ROI",
          urgency: "127 nodes créés cette semaine"
        };
    }
  };

  const ctaConfig = getCtaConfig();

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-yellow-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-orange-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Social Proof Bar */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 mb-8 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>{metrics.activeNodes}+ nodes actifs</span>
              </div>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">⚡</span>
                <span>{metrics.forceClosePrevented} force-closes évités</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
              Automatisez vos{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                revenus Lightning
              </span>{' '}
              avec l'IA
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl">
              La seule solution qui <strong className="text-yellow-400">prédit et évite les force-closes</strong> 6h à l'avance.
              <span className="block mt-2 text-lg text-gray-400">
                Utilisé par 500+ node runners • {metrics.averageROI} de revenus en moyenne
              </span>
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handlePrimaryCTA}
                className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 hover:from-yellow-300 hover:to-orange-300 hover:shadow-xl hover:shadow-yellow-400/30 hover:transform hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center">
                  ⚡ {ctaConfig.primary}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
              </button>

              <button
                onClick={handleSecondaryCTA}
                className="border-2 border-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:border-yellow-400 hover:bg-yellow-400/10 transition-all duration-300"
              >
                {ctaConfig.secondary}
              </button>
            </div>

            {/* Urgency/Social Proof */}
            <div className="flex items-center justify-center lg:justify-start text-sm text-gray-400 mb-8">
              <span className="bg-green-400/10 border border-green-400 text-green-400 px-3 py-1 rounded-full mr-4">
                🟢 {ctaConfig.urgency}
              </span>
              <span>Aucune carte bancaire requise</span>
            </div>

            {/* Quick Email Capture */}
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-1 bg-gray-800 border border-gray-600 text-white px-4 py-3 rounded-lg focus:border-yellow-400 focus:outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-800 border border-gray-600 text-white px-6 py-3 rounded-lg hover:border-yellow-400 hover:bg-yellow-400/10 transition-colors duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? 'Envoi...' : 'Commencer'}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center sm:text-left">
                Accès immédiat au calculateur ROI personnalisé
              </p>
            </form>
          </div>

          {/* Right Column - Visual/Metrics */}
          <div className="relative">
            {/* Live Metrics Dashboard Preview */}
            <div className="bg-gray-800/50 backdrop-blur-lg border border-gray-700 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Performance Live</h3>
                <div className="flex items-center text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  En direct
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-400 font-mono">
                    {metrics.totalRevenue}
                  </div>
                  <div className="text-sm text-gray-400">Revenus générés</div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-400 font-mono">
                    {metrics.averageROI}
                  </div>
                  <div className="text-sm text-gray-400">ROI moyen</div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-400 font-mono">
                    {metrics.activeNodes}
                  </div>
                  <div className="text-sm text-gray-400">Nodes actifs</div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-400 font-mono">
                    {metrics.forceClosePrevented}
                  </div>
                  <div className="text-sm text-gray-400">Force-closes évités</div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-yellow-400/10 to-orange-400/10 border border-yellow-400/20 rounded-xl p-4">
                <div className="text-yellow-400 text-2xl mb-2">🔮</div>
                <h4 className="text-white font-semibold mb-1">Prédiction IA</h4>
                <p className="text-gray-400 text-sm">6h d'avance sur les force-closes</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-400/10 to-blue-400/10 border border-green-400/20 rounded-xl p-4">
                <div className="text-green-400 text-2xl mb-2">⚡</div>
                <h4 className="text-white font-semibold mb-1">Routing Optimisé</h4>
                <p className="text-gray-400 text-sm">+40% de revenus moyens</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-400/10 to-pink-400/10 border border-purple-400/20 rounded-xl p-4">
                <div className="text-purple-400 text-2xl mb-2">📊</div>
                <h4 className="text-white font-semibold mb-1">Analytics 24/7</h4>
                <p className="text-gray-400 text-sm">Dashboard temps réel</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-400/10 to-cyan-400/10 border border-blue-400/20 rounded-xl p-4">
                <div className="text-blue-400 text-2xl mb-2">🛡️</div>
                <h4 className="text-white font-semibold mb-1">Alertes Smart</h4>
                <p className="text-gray-400 text-sm">WhatsApp & Telegram</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-400 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};
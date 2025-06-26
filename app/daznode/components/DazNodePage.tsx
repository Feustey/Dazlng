"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import DazNodeHero from './Hero';
import { UnifiedPricingSection } from '@/components/shared/ui/UnifiedPricingSection';
import { IntegratedROICalculator } from '@/components/shared/ui/IntegratedROICalculator';
import { TechnicalProofsSection } from '@/components/shared/ui/TechnicalProofsSection';

// Schema.org JSON-LD pour Rich Snippets
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "DazNode",
  "description": "Plateforme professionnelle de gestion de nœuds Lightning Network avec IA d'optimisation",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Linux, Windows, macOS",
  "offers": [
    {
      "@type": "Offer",
      "name": "DazNode Starter",
      "price": "50000",
      "priceCurrency": "SATS",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01"
    },
    {
      "@type": "Offer", 
      "name": "DazNode Pro",
      "price": "150000",
      "priceCurrency": "SATS",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01"
    },
    {
      "@type": "Offer", 
      "name": "DazNode Enterprise",
      "price": "400000",
      "priceCurrency": "SATS",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127",
    "bestRating": "5"
  },
  "features": [
    "Optimisation IA des routes de paiement",
    "Analytics predictives temps réel", 
    "Gestion multi-nœuds",
    "API complète pour intégrations",
    "Support prioritaire 24/7",
    "SLA 99.98% avec compensation"
  ]
};

const DazNodePage: React.FC = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <DazNodeHero />

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DazNode intègre les dernières technologies d'IA pour optimiser vos nœuds Lightning Network
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">IA d'Optimisation</h3>
              <p className="text-gray-600">
                Notre IA analyse en temps réel les routes de paiement pour maximiser vos revenus de routing.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics Avancés</h3>
              <p className="text-gray-600">
                Tableaux de bord temps réel avec métriques prédictives et alertes intelligentes.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sécurité Enterprise</h3>
              <p className="text-gray-600">
                Audit de sécurité inclus, conformité réglementaire et sauvegarde automatique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <IntegratedROICalculator />

      {/* Technical Proofs Section */}
      <TechnicalProofsSection />

      {/* Unified Pricing Section */}
      <UnifiedPricingSection />
    </main>
  );
};

export default DazNodePage; 
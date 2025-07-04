"use client";

import React from "react";
import { useRouter } from "next/navigation";
import DazNodeHero from "./Hero";
import { UnifiedPricingSection } from "@/components/shared/ui/UnifiedPricingSection";
import { IntegratedROICalculator } from "@/components/shared/ui/IntegratedROICalculator";
import { TechnicalProofsSection } from "@/components/shared/ui/TechnicalProofsSection";

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
    <main>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <DazNodeHero />

      {/* Features Section */}
      <section>
        <div>
          <div>
            <h2>
              Fonctionnalités Avancées
            </h2>
            <p>
              DazNode intègre les dernières technologies d'IA pour optimiser vos nœuds Lightning Network
            </p>
          </div>
          
          <div>
            {/* Feature cards */}
            <div>
              <div>
                <svg>
                  <path></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">IA d'optimisation</h3>
              <p>
                Notre IA analyse en temps réel les routes de paiement pour maximiser vos revenus de routing.
              </p>
            </div>

            <div>
              <div>
                <svg>
                  <path></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Analytics avancés</h3>
              <p>
                Tableaux de bord temps réel avec métriques prédictives et alertes intelligentes.
              </p>
            </div>

            <div>
              <div>
                <svg>
                  <path></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sécurité enterprise</h3>
              <p>
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
export const dynamic = "force-dynamic";

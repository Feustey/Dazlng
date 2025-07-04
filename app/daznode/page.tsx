import React from "react";
import { Metadata } from "next";
import DazNodePage from "./components/DazNodePage";
import { seoConfig } from "@/lib/seo-config";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

// Structured data avancé pour DazNode
const dazNodeStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "DazNode",
  "description": "Plateforme professionnelle de gestion de nœuds Lightning Network avec IA d'optimisation",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Linux, Windows, macOS",
  "url": `${seoConfig.baseUrl}/daznode`,
  "softwareVersion": "2.0",
  "datePublished": "2024-01-01",
  "dateModified": "2025-01-27",
  "author": {
    "@type": "Organization",
    "name": "DazNode",
    "url": seoConfig.baseUrl
  },
  "publisher": {
    "@type": "Organization",
    "name": "DazNode",
    "url": seoConfig.baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${seoConfig.baseUrl}/assets/images/logo-daznode.svg`
    }
  },
  "offers": [
    {
      "@type": "Offer",
      "name": "DazNode Starter",
      "price": "50000",
      "priceCurrency": "SATS",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01",
      "description": "Plan de base pour débuter avec Lightning Network"
    },
    {
      "@type": "Offer",
      "name": "DazNode Pro",
      "price": "150000",
      "priceCurrency": "SATS",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01",
      "description": "Plan professionnel avec IA d'optimisation"
    },
    {
      "@type": "Offer",
      "name": "DazNode Enterprise",
      "price": "400000",
      "priceCurrency": "SATS",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01",
      "description": "Plan entreprise avec support prioritaire"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  },
  "review": [
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Bitcoin Expert"
      },
      "reviewBody": "DazNode simplifie vraiment l'accès au Lightning Network. Installation en 5 minutes et revenus dès le premier jour.",
      "datePublished": "2024-12-15"
    },
    {
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Lightning Developer"
      },
      "reviewBody": "L'IA d'optimisation est impressionnante. Mes revenus ont augmenté de 40% en 2 semaines.",
      "datePublished": "2024-12-20"
    }
  ],
  "features": [
    "Optimisation IA des routes de paiement",
    "Analytics predictives temps réel",
    "Gestion multi-nœuds",
    "API complète pour intégrations",
    "Support prioritaire 24/7",
    "SLA 99.98% avec compensation"
  ],
  "screenshot": [
    {
      "@type": "ImageObject",
      "url": `${seoConfig.baseUrl}/assets/images/daznode-dashboard.png`,
      "caption": "Dashboard DazNode avec métriques temps réel"
    }
  ],
  "downloadUrl": `${seoConfig.baseUrl}/daznode`,
  "installUrl": `${seoConfig.baseUrl}/checkout/daznode`,
  "softwareRequirements": "Node.js 18+, 4GB RAM, Connexion Internet stable",
  "permissions": "Accès réseau pour Lightning Network, Stockage local pour données"
};

export const metadata: Metadata = {
  title: "DazNode | Gestion Avancée de Nœuds Lightning Network",
  description: "DazNode offre une gestion professionnelle de nœuds Lightning Network avec IA d'optimisation, analytics avancés et support expert. Maximisez vos revenus Lightning.",
  keywords: [
    "DazNode", "Lightning Network", "Bitcoin", "nœud Lightning professionnel", "gestion nœud", "optimisation IA", "analytics Lightning", "revenus Lightning", "infrastructure Bitcoin", "routing fees optimization"
  ],
  authors: [{ name: "DazNode" }],
  creator: "DazNode",
  publisher: "DazNode",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: `${seoConfig.baseUrl}/daznode`,
    title: "DazNode | Gestion Avancée de Nœuds Lightning Network",
    description: "DazNode offre une gestion professionnelle de nœuds Lightning Network avec IA d'optimisation, analytics avancés et support expert. Maximisez vos revenus Lightning.",
    siteName: "DazNode",
    images: [
      {
        url: `${seoConfig.baseUrl}/assets/images/daznode-og.png`,
        width: 1200,
        height: 630,
        alt: "DazNode - Gestion Avancée de Nœuds Lightning Network"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "DazNode | Gestion Avancée de Nœuds Lightning Network",
    description: "DazNode offre une gestion professionnelle avec IA d'optimisation.",
    images: [`${seoConfig.baseUrl}/assets/images/daznode-og.png`],
    creator: "@daznode"
  },
  alternates: {
    canonical: `${seoConfig.baseUrl}/daznode`,
    languages: {
      "fr": `${seoConfig.baseUrl}/fr/daznode`,
      "en": `${seoConfig.baseUrl}/en/daznode`,
      "x-default": `${seoConfig.baseUrl}/daznode`
    }
  },
  verification: {
    google: "your-google-site-verification"
  }
};

const DazNodePageWrapper: React.FC = () => {
  const { t } = useAdvancedTranslation("daznode");

  return (
    <>
      {/* Structured data avancé */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dazNodeStructuredData)
        }}
      />
      <DazNodePage />
    </>
  );
};

export default DazNodePageWrapper;
export const dynamic = "force-dynamic";
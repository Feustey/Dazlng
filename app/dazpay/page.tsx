import React from "react";
import { Metadata } from "next";
import DazPayHero from "./components/Hero";
import { seoConfig } from "@/lib/seo-config";

// Structured data avancé pour DazPay
const dazPayStructuredData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "DazPay",
  "description": "Solution complète de paiement Lightning Network pour commerces et entreprises",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Linux, Windows, macOS, iOS, Android",
  "url": `${seoConfig.baseUrl}/dazpay`,
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
      "name": "DazPay Standard",
      "price": "1",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01",
      "description": "Commission de 1% par transaction Lightning"
    },
    {
      "@type": "Offer",
      "name": "DazPay Pro",
      "price": "15",
      "priceCurrency": "SATS",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01",
      "description": "Abonnement mensuel + 0.5% par transaction"
    }
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "234",
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
        "name": "Restaurant Owner"
      },
      "reviewBody": "DazPay a révolutionné mes paiements. Plus de frais bancaires, transactions instantanées !",
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
        "name": "E-commerce Manager"
      },
      "reviewBody": "Intégration simple, conversion automatique BTC/EUR. Parfait pour notre boutique en ligne.",
      "datePublished": "2024-12-20"
    }
  ],
  "features": [
    "Terminal de paiement Lightning",
    "Interface d'encaissement simple",
    "Dashboard marchand complet",
    "Conversion automatique BTC/EUR",
    "API pour intégrations e-commerce",
    "Support multidevice",
    "Paiements instantanés",
    "Frais réduits vs cartes bancaires"
  ],
  "screenshot": [
    {
      "@type": "ImageObject",
      "url": `${seoConfig.baseUrl}/assets/images/dazpay-terminal.png`,
      "caption": "Terminal de paiement DazPay"
    },
    {
      "@type": "ImageObject",
      "url": `${seoConfig.baseUrl}/assets/images/dazpay-dashboard.png`,
      "caption": "Dashboard marchand DazPay"
    }
  ],
  "downloadUrl": `${seoConfig.baseUrl}/dazpay`,
  "installUrl": `${seoConfig.baseUrl}/checkout/dazpay`,
  "softwareRequirements": "Navigateur moderne, Connexion Internet stable",
  "permissions": "Accès réseau pour Lightning Network, Stockage local pour données de session",
  "serviceType": "Payment Processing",
  "areaServed": [
    {
      "@type": "Country",
      "name": "France"
    },
    {
      "@type": "Country",
      "name": "Belgique"
    },
    {
      "@type": "Country",
      "name": "Suisse"
    },
    {
      "@type": "Country",
      "name": "Canada"
    }
  ],
  "paymentAccepted": [
    "Bitcoin Lightning Network",
    "Sats",
    "BTC"
  ]
};

export const metadata: Metadata = {
  title: "DazPay | Terminal de Paiement Lightning Network",
  description: "Acceptez les paiements Lightning Network dans votre commerce. Terminal simple, conversion automatique BTC/EUR, frais réduits.",
  keywords: [
    "dazpay",
    "paiement lightning",
    "terminal bitcoin",
    "commerce bitcoin",
    "paiement crypto",
    "lightning network",
    "btc eur",
    "conversion bitcoin",
    "pos bitcoin",
    "encaissement crypto"
  ],
  authors: [{ name: "DazNode" }],
  creator: "DazNode",
  publisher: "DazNode",
  openGraph: {
    title: "DazPay | Terminal de Paiement Lightning Network",
    description: "Acceptez les paiements Lightning Network dans votre commerce. Terminal simple, conversion automatique BTC/EUR, frais réduits.",
    url: `${seoConfig.baseUrl}/dazpay`,
    siteName: "DazNode",
    type: "website",
    images: [
      {
        url: `${seoConfig.baseUrl}/assets/images/dazpay-og.png`,
        width: 1200,
        height: 630,
        alt: "DazPay - Terminal de Paiement Lightning Network"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "DazPay | Terminal de Paiement Lightning Network",
    description: "Acceptez les paiements Lightning Network dans votre commerce. Terminal simple, conversion automatique BTC/EUR, frais réduits.",
    images: [`${seoConfig.baseUrl}/assets/images/dazpay-og.png`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  alternates: {
    canonical: `${seoConfig.baseUrl}/dazpay`,
    languages: {
      "fr": `${seoConfig.baseUrl}/fr/dazpay`,
      "en": `${seoConfig.baseUrl}/en/dazpay`,
      "x-default": `${seoConfig.baseUrl}/dazpay`
    }
  }
};

const DazPayPage: React.FC = () => {
  return (
    <main>
      {/* Structured data avancé */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dazPayStructuredData) }}
      />

      {/* Hero Section */}
      <DazPayHero />

      {/* Features Section */}
      <section>
        <div>
          <div>
            <h2>
              Fonctionnalités Commerciales
            </h2>
            <p>
              DazPay offre tout ce dont vous avez besoin pour accepter les paiements Lightning
            </p>
          </div>
          
          <div>
            {/* Feature 1 */}
            <div>
              <div className="text-blue-600 text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">Paiements instantanés</h3>
              <p>
                Transactions Lightning Network en quelques secondes, sans confirmation Bitcoin.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div>
              <div className="text-green-600 text-3xl mb-4">💱</div>
              <h3 className="text-xl font-semibold mb-3">Conversion automatique</h3>
              <p>
                Conversion BTC/EUR automatique pour éviter la volatilité du Bitcoin.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div>
              <div className="text-purple-600 text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">Dashboard complet</h3>
              <p>
                Interface marchand avec analytics, rapports et gestion des transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section>
        <div>
          <div>
            <h2>
              Tarifs Transparents
            </h2>
            <p>
              Pas de frais cachés, pas d'engagement. Payez seulement ce que vous utilisez.
            </p>
          </div>
          
          <div>
            {/* Plan Standard */}
            <div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard</h3>
                <p className="text-gray-600 mb-6">Parfait pour débuter</p>
                <div className="text-4xl font-bold text-gray-900">1%<span className="text-lg text-gray-500"> par transaction</span></div>
                <p className="text-sm text-gray-500 mt-2">0 sats de frais d'installation</p>
              </div>
              
              <ul>
                <li>
                  <svg>
                    <path></path>
                  </svg>
                  <span className="text-gray-700">Terminal Lightning simple</span>
                </li>
                <li>
                  <svg>
                    <path></path>
                  </svg>
                  <span className="text-gray-700">Dashboard basique</span>
                </li>
                <li>
                  <svg>
                    <path></path>
                  </svg>
                  <span className="text-gray-700">Support email</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DazPayPage;
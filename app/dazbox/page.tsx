import React from "react";
import { Metadata } from "next";
import DazBoxClientHero from "./components/ClientHero";
import DazBoxFeatures from "./components/Features";
import DazBoxPricing from "./components/Pricing";
import { seoConfig } from "@/lib/seo-config";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

// Structured data avancé pour DazBox
const dazBoxStructuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "DazBox",
  "description": "Solution Lightning Network Plug & Play pour générer des revenus passifs",
  "brand": {
    "@type": "Organization",
    "name": "DazNode",
    "url": seoConfig.baseUrl
  },
  "manufacturer": {
    "@type": "Organization",
    "name": "DazNode",
    "url": seoConfig.baseUrl
  },
  "model": "DazBox v2.0",
  "sku": "DB-2024-001",
  "mpn": "DAZBOX-2024",
  "category": "Hardware",
  "url": `${seoConfig.baseUrl}/dazbox`,
  "image": [
    `${seoConfig.baseUrl}/assets/images/dazbox-hero.png`,
    `${seoConfig.baseUrl}/assets/images/dazbox-dashboard.png`
  ],
  "offers": [
    {
      "@type": "Offer",
      "name": "DazBox Starter",
      "price": "400",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01",
      "description": "Kit de démarrage Lightning Network",
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "EUR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      }
    },
    {
      "@type": "Offer",
      "name": "DazBox Pro",
      "price": "449",
      "priceCurrency": "EUR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-01-01",
      "description": "Solution professionnelle avec support prioritaire",
      "itemCondition": "https://schema.org/NewCondition",
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "EUR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 2,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 5,
            "unitCode": "DAY"
          }
        }
      }
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
        "name": "common.bitcoin_expert"
      },
      "reviewBody": "DazBox simplifie vraiment l'accès au Lightning Network. Installation en 5 minutes et revenus dès le premier jour.",
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
        "name": "common.lightning_developer"
      },
      "reviewBody": "Matériel de qualité, interface intuitive. Parfait pour débuter avec Lightning Network.",
      "datePublished": "2024-12-20"
    }
  ],
  "additionalProperty": [
    {
      "@type": "PropertyValue",
      "name": "Puissance",
      "value": "15W"
    },
    {
      "@type": "PropertyValue",
      "name": "Connectivité",
      "value": "Ethernet + WiFi"
    },
    {
      "@type": "PropertyValue",
      "name": "Stockage",
      "value": "500GB SSD"
    },
    {
      "@type": "PropertyValue",
      "name": "RAM",
      "value": "4GB"
    }
  ],
  "warranty": {
    "@type": "WarrantyPromise",
    "warrantyScope": "https://schema.org/ComprehensiveWarranty",
    "durationOfWarranty": {
      "@type": "QuantitativeValue",
      "value": 2,
      "unitCode": "ANN"
    }
  },
  "serviceType": "Lightning Network Node Management",
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
    }
  ]
};

export const metadata: Metadata = {
  title: "DazBox | Solution Lightning Network Plug & Play",
  description: "DazBox simplifie l'économie Bitcoin avec une solution Lightning Network plug & play.",
  keywords: [
    "DazBox", "Lightning Network", "Bitcoin", "nœud Lightning", "plug and play", "solution Bitcoin", "paiement crypto", "finance décentralisée", "earning sats", "routing fees"
  ],
  authors: [{ name: "DazNode" }],
  creator: "DazNode",
  publisher: "DazNode",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: `${seoConfig.baseUrl}/dazbox`,
    title: "DazBox | Solution Lightning Network Plug & Play",
    description: "DazBox simplifie l'économie Bitcoin avec une solution Lightning Network plug & play.",
    siteName: "DazNode",
    images: [
      {
        url: `${seoConfig.baseUrl}/assets/images/dazbox-og.png`,
        width: 1200,
        height: 630,
        alt: "DazBox - Solution Lightning Network Plug & Play"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "DazBox | Solution Lightning Network Plug & Play",
    description: "DazBox simplifie l'économie Bitcoin",
    images: [`${seoConfig.baseUrl}/assets/images/dazbox-og.png`],
    creator: "@daznode"
  },
  alternates: {
    canonical: `${seoConfig.baseUrl}/dazbox`,
    languages: {
      "fr": `${seoConfig.baseUrl}/fr/dazbox`,
      "en": `${seoConfig.baseUrl}/en/dazbox`,
      "x-default": `${seoConfig.baseUrl}/dazbox`
    }
  },
  verification: {
    google: "your-google-site-verification"
  }
};

const DazBoxPage: React.FC = () => {
  const { t } = useAdvancedTranslation("dazbox");
  
  return (
    <>
      {/* Structured data avancé */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(dazBoxStructuredData)
        }}
      />
      
      {/* Hero Section */}
      <DazBoxClientHero />
      
      {/* Features Section */}
      <DazBoxFeatures />
      
      {/* Pricing Section */}
      <DazBoxPricing />
      
      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce Que Disent Nos{" "}
              <span className="text-indigo-600">Utilisateurs</span>
            </h2>
            <p className="text-lg text-gray-600">
              Plus de 500 utilisateurs nous font confiance pour leurs nœuds Lightning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
                <span className="ml-2 text-sm text-gray-600">{t("common.expert_bitcoin")}</span>
              </div>
              <p className="text-gray-700">
                "DazBox simplifie vraiment l'accès au Lightning Network. Installation en 5 minutes et revenus dès le premier jour."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
                <span className="ml-2 text-sm text-gray-600">{t("common.developpeur_lightning")}</span>
              </div>
              <p className="text-gray-700">
                "Matériel de qualité, interface intuitive. Parfait pour débuter avec Lightning Network."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
                <span className="ml-2 text-sm text-gray-600">{t("common.passionne_crypto")}</span>
              </div>
              <p className="text-gray-700">
                "Support client exceptionnel et revenus passifs qui dépassent mes attentes. Je recommande !"
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default DazBoxPage;
export const dynamic = "force-dynamic";
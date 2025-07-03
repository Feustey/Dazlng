import React from 'react';
import { Metadata } from 'next';
import DazBoxClientHero from './components/ClientHero';
import DazBoxFeatures from './components/Features';
import DazBoxPricing from './components/Pricing';
import { seoConfig } from '@/lib/seo-config';

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
        "name": "Bitcoin Expert"
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
        "name": "Lightning Developer"
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
  title: 'DazBox | Solution Lightning Network Plug & Play',
  description: 'DazBox simplifie le réseau Lightning avec une solution plug & play. Déployez votre nœud Lightning en 5 minutes, gagnez des sats et participez à l\'économie Bitcoin.',
  keywords: [
    'DazBox',
    'Lightning Network',
    'Bitcoin',
    'nœud Lightning',
    'plug and play',
    'solution Bitcoin',
    'paiement crypto',
    'finance décentralisée',
    'earning sats',
    'routing fees'
  ],
  authors: [{ name: 'DazNode' }],
  creator: 'DazNode',
  publisher: 'DazNode',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: `${seoConfig.baseUrl}/dazbox`,
    title: 'DazBox | Solution Lightning Network Plug & Play',
    description: 'DazBox simplifie le réseau Lightning avec une solution plug & play. Déployez votre nœud Lightning en 5 minutes, gagnez des sats et participez à l\'économie Bitcoin.',
    siteName: 'DazNode',
    images: [
      {
        url: `${seoConfig.baseUrl}/assets/images/dazbox-og.png`,
        width: 1200,
        height: 630,
        alt: 'DazBox - Solution Lightning Network Plug & Play'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DazBox | Solution Lightning Network Plug & Play',
    description: 'DazBox simplifie le réseau Lightning avec une solution plug & play. Déployez votre nœud Lightning en 5 minutes.',
    images: [`${seoConfig.baseUrl}/assets/images/dazbox-og.png`],
    creator: '@daznode'
  },
  alternates: {
    canonical: `${seoConfig.baseUrl}/dazbox`,
    languages: {
      'fr': `${seoConfig.baseUrl}/fr/dazbox`,
      'en': `${seoConfig.baseUrl}/en/dazbox`,
      'x-default': `${seoConfig.baseUrl}/dazbox`
    }
  },
  verification: {
    google: 'your-google-site-verification'
  }
};

const DazBoxPage: React.FC = () => {
  return (
    <>
      {/* Structured data avancé */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dazBoxStructuredData) }}
      />
      
      {/* Hero Section */}
      <DazBoxClientHero />
      
      {/* Features Section */}
      <DazBoxFeatures />
      
      {/* Pricing Section */}
      <DazBoxPricing />
      
      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ce Que Disent Nos{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Utilisateurs
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Plus de 500 utilisateurs nous font confiance pour leurs nœuds Lightning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
                <span className="ml-2 text-sm text-gray-600">Bitcoin Expert</span>
              </div>
              <p className="text-gray-700">
                "DazBox simplifie vraiment l'accès au Lightning Network. Installation en 5 minutes et revenus dès le premier jour."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
                <span className="ml-2 text-sm text-gray-600">Lightning Developer</span>
              </div>
              <p className="text-gray-700">
                "Matériel de qualité, interface intuitive. Parfait pour débuter avec Lightning Network."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="text-yellow-400 text-2xl">★★★★★</div>
                <span className="ml-2 text-sm text-gray-600">Crypto Enthusiast</span>
              </div>
              <p className="text-gray-700">
                "Support client exceptionnel et revenus passifs qui dépassent mes attentes. Je recommande !"
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Questions{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Fréquentes
              </span>
            </h2>
          </div>
          
          <div className="space-y-8">
            {[
              {
                q: "Combien puis-je gagner avec ma DazBox ?",
                a: "Les revenus dépendent de plusieurs facteurs : votre investissement initial, l'activité du réseau Lightning et votre configuration. En moyenne, nos utilisateurs gagnent entre 50 Sats et 200Sats par mois, soit un ROI de 8% à 15% annuel."
              },
              {
                q: "L'installation est-elle vraiment si simple ?",
                a: "Oui ! Branchez votre DazBox à internet et à l'électricité, elle se configure automatiquement. Aucune compétence technique requise. 95% de nos utilisateurs sont opérationnels en moins de 10 minutes."
              },
              {
                q: "Que se passe-t-il si j'ai un problème ?",
                a: "Notre équipe de support expert est disponible 24/7 par chat, email ou téléphone. Temps de réponse moyen : 5 minutes. De plus, votre DazBox se répare automatiquement dans 99% des cas."
              },
              {
                q: "Y a-t-il des frais cachés ?",
                a: "Aucun frais caché. Le prix d'achat inclut tout : livraison, installation, support et mises à jour à vie. Les seuls coûts additionnels sont l'électricité (≈2Sats/mois) et votre connexion internet."
              },
              {
                q: "Puis-je essayer avant d'acheter ?",
                a: "Absolument ! Nous offrons une garantie satisfait ou remboursé de 30 jours. Si vous n'êtes pas entièrement satisfait, nous reprenons votre DazBox et vous remboursons intégralement."
              }
            ].map((faq: any, index: any) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {faq.q}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à Générer Vos Premiers{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-400 text-transparent bg-clip-text">
              Revenus Passifs ?
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les centaines d'utilisateurs qui gagnent déjà avec DazBox. 
            Installation en 5 minutes, revenus dès le premier jour.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold px-8 py-4 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              Commander Ma DazBox
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 text-lg bg-transparent rounded-xl font-bold transition-all duration-300">
              Parler à un Expert
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-blue-100 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Garantie 30 jours</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Livraison gratuite</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Support 24/7</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DazBoxPage;
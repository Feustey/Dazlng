import React from 'react';
import { Metadata } from 'next';
import DazPayHero from './components/Hero';
import { seoConfig } from '@/lib/seo-config';

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
    "common.conversion_automatique_btceur",
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
  title: 'DazPay | Terminal de Paiement Lightning Network',
  description: "common.commoncommonacceptez_les_paiem",
  keywords: [
    'dazpay',
    'paiement lightning',
    'terminal bitcoin',
    'commerce bitcoin',
    'paiement crypto',
    'lightning network',
    'btc eur',
    'conversion bitcoin',
    'pos bitcoin',
    'encaissement crypto'
  ],
  authors: [{ name: 'DazNode' }],
  creator: 'DazNode',
  publisher: 'DazNode',
  openGraph: {
    title: 'DazPay | Terminal de Paiement Lightning Network',
    description: "common.commoncommonacceptez_les_paiem",
    url: `${seoConfig.baseUrl}/dazpay`,
    siteName: 'DazNode',
    type: 'website',
    images: [
      {
        url: `${seoConfig.baseUrl}/assets/images/dazpay-og.png`,
        width: 1200,
        height: 630,
        alt: 'DazPay - Terminal de Paiement Lightning Network'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DazPay | Terminal de Paiement Lightning Network',
    description: "common.commoncommonacceptez_les_paiem",
    images: [`${seoConfig.baseUrl}/assets/images/dazpay-og.png`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      "common.commoncommonmaximagepreview": 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `${seoConfig.baseUrl}/dazpay`,
    languages: {
      'fr': `${seoConfig.baseUrl}/fr/dazpay`,
      'en': `${seoConfig.baseUrl}/en/dazpay`,
      'x-default': `${seoConfig.baseUrl}/dazpay`
    }
  }
};

const DazPayPage: React.FC = () => {
  return (
    <main className="min-h-screen">
      {/* Structured data avancé */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dazPayStructuredData) }}
      />

      {/* Hero Section */}
      <DazPayHero />

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Commerciales
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              DazPay offre tout ce dont vous avez besoin pour accepter les paiements Lightning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-blue-600 text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">{t('common.paiements_instantans')}</h3>
              <p className="text-gray-600">
                Transactions Lightning Network en quelques secondes, sans confirmation Bitcoin.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-green-600 text-3xl mb-4">💱</div>
              <h3 className="text-xl font-semibold mb-3">{t('common.conversion_automatique')}</h3>
              <p className="text-gray-600">
                Conversion BTC/EUR automatique pour éviter la volatilité du Bitcoin.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="text-purple-600 text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-3">{t('common.dashboard_complet')}</h3>
              <p className="text-gray-600">
                Interface marchand avec analytics, rapports et gestion des transactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Tarifs Transparents
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pas de frais cachés, pas d'engagement. Payez seulement ce que vous utilisez.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Standard */}
            <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 relative">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Standard</h3>
                <p className="text-gray-600 mb-6">{t('common.parfait_pour_dbuter')}</p>
                <div className="text-4xl font-bold text-gray-900">1%<span className="text-lg text-gray-500">{t('common._par_transaction')}</span></div>
                <p className="text-sm text-gray-500 mt-2">{t('common.0sats_de_frais_dinstallation')}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{t('common.terminal_lightning_simple')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{t('common.dashboard_basique')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{t('common.support_par_email')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{t('common.intgration_ecommerce')}</span>
                </li>
              </ul>
              
              <button className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-xl transition-colors">
                Commencer Gratuitement
              </button>
            </div>

            {/* Plan Pro */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 relative text-white">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                  Recommandé
                </span>
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold mb-2">Pro</h3>
                <p className="text-orange-100 mb-6">{t('common.pour_les_commerces_actifs')}</p>
                <div className="text-3xl font-bold">15Sats<span className="text-lg text-orange-200">{t('common.mois')}</span></div>
                <p className="text-sm text-orange-200 mt-1">{t('common._05_par_transaction')}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t('common.terminal_avanc_multidevice')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t('common.dashboard_premium_analytics')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t('common.support_prioritaire_247')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t('common.api_complte_webhooks')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{t('common.conversion_automatique_btceur')}</span>
                </li>
              </ul>
              
              <button className="w-full bg-white text-orange-600 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors">
                Essai Gratuit 14 Jours
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-red-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à Accepter des{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-orange-200 text-transparent bg-clip-text">
              Paiements Lightning ?
            </span>
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Rejoignez les milliers de commerces qui acceptent déjà le Bitcoin. 
            Installation en 5 minutes, premier paiement dès aujourd'hui.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="bg-white text-orange-600 font-bold px-8 py-4 text-lg rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              Commencer Gratuitement
            </button>
            <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 text-lg bg-transparent rounded-xl font-bold transition-all duration-300">
              Voir une Démo
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-8 text-orange-100 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{t('common.installation_gratuite')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{t('common.pas_dengagement')}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{t('common.support_247')}</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DazPayPage; export const dynamic = "force-dynamic";

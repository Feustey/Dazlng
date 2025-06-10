import { Inter } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import React from 'react';
import { SupabaseProvider } from './providers/SupabaseProvider'
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'DazNode | Solutions Lightning Network pour tous',
    template: '%s | DazNode'
  },
  description: 'DazNode simplifie l\'accès au réseau Lightning avec des solutions clés en main : nœuds personnalisés DazBox, plateforme DazNode Pro et terminal DazPay. Infrastructure Bitcoin complète avec IA prédictive pour particuliers et professionnels.',
  keywords: [
    'Lightning Network', 'Bitcoin', 'DazNode', 'DazBox', 'DazPay', 
    'nœud Lightning', 'paiement Bitcoin', 'infrastructure crypto', 
    'finance décentralisée', 'IA Bitcoin', 'routing fees', 'canaux Lightning',
    'wallet Bitcoin', 'terminal paiement', 'solution Bitcoin entreprise'
  ],
  authors: [{ name: 'DazNode' }],
  creator: 'DazNode',
  publisher: 'DazNode',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  metadataBase: new URL('https://dazno.de'),
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification'
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://dazno.de',
    title: 'DazNode | Solutions Lightning Network pour tous',
    description: 'Solutions Lightning Network complètes : nœuds personnalisés, plateforme pro et terminal de paiement. Infrastructure Bitcoin avec IA prédictive pour particuliers et entreprises.',
    siteName: 'DazNode',
    images: [
      {
        url: '/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DazNode - Solutions Lightning Network'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DazNode | Solutions Lightning Network pour tous',
    description: 'Solutions Lightning Network complètes avec IA prédictive : nœuds personnalisés, plateforme pro et terminal de paiement.',
    images: ['/assets/images/og-image.png'],
    creator: '@daznode',
    site: '@daznode'
  },
  alternates: {
    canonical: 'https://dazno.de',
    languages: {
      'fr-FR': 'https://dazno.de',
      'en-US': 'https://dazno.de/en'
    }
  },
  category: 'technology'
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="fr">
      <head>
        {/* Script Umami conditionnel */}
        {typeof window !== 'undefined' && window.localStorage.getItem('cookie_consent') === 'true' && (
          <script defer src="https://cloud.umami.is/script.js" data-website-id="21fab8e3-a8fd-474d-9187-9739cce7c9b5"></script>
        )}
        {/* Préchargement des fonts */}
        {/* Préconnexion aux domaines externes */}
        <link rel="dns-prefetch" href="//api.dazno.de" />
        <link rel="preconnect" href="https://api.dazno.de" crossOrigin="" />
        
        {/* Métadonnées pour les performances */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DazNode" />
      </head>
      <body className={inter.className}>
        <SupabaseProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SupabaseProvider>
      </body>
    </html>
  );
};

export default RootLayout; 
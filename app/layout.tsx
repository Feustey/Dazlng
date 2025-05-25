import { Inter } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import React from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'DazNode | Solutions Lightning Network pour tous',
    template: '%s | DazNode'
  },
  description: 'Daznode simplifie l\'accès au réseau Lightning avec des solutions clés en main. Nœuds personnels, services de paiement et IA dédiée pour particuliers et professionnels.',
  keywords: ['lightning network', 'bitcoin', 'daznode', 'dazbox', 'dazpay', 'paiement crypto', 'nœud lightning', 'finance décentralisée'],
  authors: [{ name: 'DazNode' }],
  creator: 'DazNode',
  publisher: 'DazNode',
  robots: 'index, follow',
  metadataBase: new URL('https://dazno.de'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://dazno.de',
    title: 'DazNode | Solutions Lightning Network pour tous',
    description: 'Daznode simplifie l\'accès au réseau Lightning avec des solutions clés en main. Nœuds personnels, services de paiement et IA dédiée pour particuliers et professionnels.',
    siteName: 'DazNode',
    images: [
      {
        url: 'https://dazno.de/assets/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DazNode - Solutions Lightning Network'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DazNode | Solutions Lightning Network pour tous',
    description: 'Daznode simplifie l\'accès au réseau Lightning avec des solutions clés en main. Nœuds personnels, services de paiement et IA dédiée.',
    images: ['https://dazno.de/assets/images/og-image.png']
  }
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="fr">
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="21fab8e3-a8fd-474d-9187-9739cce7c9b5"></script>
        {/* Préchargement des fonts */}
        <link
          rel="preload"
          href="/_next/static/css/app.css"
          as="style"
        />
        {/* Préconnexion aux domaines externes */}
        <link rel="dns-prefetch" href="//api.dazno.de" />
        <link rel="preconnect" href="https://api.dazno.de" crossOrigin="" />
        
        {/* Métadonnées pour les performances */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4f46e5" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DazNode" />
      </head>
      <body className={inter.className}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
};

export default RootLayout; 
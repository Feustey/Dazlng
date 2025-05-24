import './styles/globals.css';
import { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import React from 'react';

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
      </head>
      <body >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
};

export default RootLayout; 
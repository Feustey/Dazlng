import './styles/globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import ClientLayout from './ClientLayout';
import React from 'react';

const inter = Inter({ subsets: ['latin'], display: 'swap', preload: true, weight: ['400', '500', '600', '700'] });

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
  metadataBase: new URL('https://daznode.com'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://daznode.com',
    title: 'DazNode | Solutions Lightning Network pour tous',
    description: 'Daznode simplifie l\'accès au réseau Lightning avec des solutions clés en main. Nœuds personnels, services de paiement et IA dédiée pour particuliers et professionnels.',
    siteName: 'DazNode',
    images: [
      {
        url: 'https://daznode.com/assets/images/og-image.png',
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
    images: ['https://daznode.com/assets/images/og-image.png']
  }
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="fr">
      <body className={inter.className + ' text-t4g-gray min-h-screen flex flex-col font-sans antialiased'}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
};

export default RootLayout; 
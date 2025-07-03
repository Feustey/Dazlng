import { Inter } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';
import ClientLayout from './ClientLayout';
import React from 'react';
import { SupabaseProvider } from './providers/SupabaseProvider'
import Script from 'next/script';
import { seoConfig } from '@/lib/seo-config';

// Optimisation des polices pour Core Web Vitals
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Optimise LCP
  preload: true,
  fallback: ['system-ui', 'arial']
});

// Structured data global pour l'organisation
const globalStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DazNode",
  "url": seoConfig.baseUrl,
  "logo": `${seoConfig.baseUrl}/assets/images/logo-daznode.svg`,
  "description": "Solutions Lightning Network pour particuliers et professionnels",
  "foundingDate": "2024",
  "sameAs": [
    "https://twitter.com/daznode",
    "https://github.com/daznode"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "email": "contact@dazno.de"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "FR"
  }
};

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.baseUrl),
  title: {
    default: seoConfig.defaultMetadata.title,
    template: '%s | DazNode'
  },
  description: seoConfig.defaultMetadata.description,
  keywords: seoConfig.defaultMetadata.keywords,
  authors: seoConfig.defaultMetadata.authors,
  creator: seoConfig.defaultMetadata.creator,
  publisher: seoConfig.defaultMetadata.publisher,
  robots: seoConfig.defaultMetadata.robots,
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: seoConfig.baseUrl,
    title: seoConfig.defaultMetadata.title,
    description: seoConfig.defaultMetadata.description,
    siteName: 'DazNode',
    images: [
      {
        url: `${seoConfig.baseUrl}/assets/images/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'DazNode - Solutions Lightning Network'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: seoConfig.defaultMetadata.title,
    description: seoConfig.defaultMetadata.description,
    images: [`${seoConfig.baseUrl}/assets/images/og-image.png`],
    creator: '@daznode'
  },
  alternates: {
    canonical: seoConfig.baseUrl,
    languages: {
      'fr': `${seoConfig.baseUrl}/fr`,
      'en': `${seoConfig.baseUrl}/en`,
      'x-default': seoConfig.baseUrl
    }
  },
  verification: {
    google: 'your-google-site-verification',
    yandex: 'your-yandex-verification',
    yahoo: 'your-yahoo-verification'
  },
  other: {
    'msapplication-TileColor': '#3B82F6',
    'theme-color': '#3B82F6'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.className}>
      <head>
        {/* Preload des ressources critiques pour Core Web Vitals */}
        <link 
          rel="preload" 
          href="/assets/images/logo-daznode.svg" 
          as="image" 
          type="image/svg+xml"
        />
        <link 
          rel="preload" 
          href="/assets/images/hero-bg.jpg" 
          as="image" 
          type="image/jpeg"
        />
        
        {/* DNS prefetch pour les domaines externes */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//api.dazno.de" />
        
        {/* Preconnect pour les connexions critiques */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://api.dazno.de" />
        
        {/* Structured data global */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalStructuredData) }}
        />
        
        {/* Web App Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Favicon optimisé */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Meta tags pour Core Web Vitals */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="color-scheme" content="light dark" />
        
        {/* Optimisations de performance */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>
      <body className="antialiased">
        {/* Scripts de performance non-bloquants */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>
        
        <SupabaseProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </SupabaseProvider>
        
        {/* Script de performance pour Core Web Vitals */}
        <Script id="web-vitals" strategy="afterInteractive">
          {`
            import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
            
            getCLS(console.log);
            getFID(console.log);
            getFCP(console.log);
            getLCP(console.log);
            getTTFB(console.log);
          `}
        </Script>
      </body>
    </html>
  );
} export const dynamic = "force-dynamic";

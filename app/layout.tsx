import { Inter } from "next/font/google";
import "./globals.css";
import { Metadata } from "next";
import ClientLayout from "./ClientLayout";
import React from "react";
import { SupabaseProvider } from "./providers/SupabaseProvider";
import { seoConfig } from "@/lib/seo-config";

// Optimisation des polices
const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "arial"],
  preload: true // Précharger les polices critiques
});

// Structured data optimisé
const globalStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "DazNode",
  "url": seoConfig.baseUrl,
  "logo": `${seoConfig.baseUrl}/assets/images/logo-daznode.svg`,
  "description": "Solutions Lightning Network pour particuliers et professionnels"
};

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.baseUrl),
  title: {
    default: seoConfig.defaultMetadata.title,
    template: "%s | DazNode"
  },
  description: seoConfig.defaultMetadata.description,
  // Supprimer les métadonnées redondantes
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: seoConfig.baseUrl,
    title: seoConfig.defaultMetadata.title,
    description: seoConfig.defaultMetadata.description,
    siteName: "DazNode",
    images: [{
      url: `${seoConfig.baseUrl}/assets/images/og-image.png`,
      width: 1200,
      height: 630,
      alt: "DazNode - Solutions Lightning Network"
    }]
  },
  twitter: {
    card: "summary_large_image",
    title: seoConfig.defaultMetadata.title,
    description: seoConfig.defaultMetadata.description,
    images: [`${seoConfig.baseUrl}/assets/images/og-image.png`]
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={inter.className}>
      <head>
        {/* DNS prefetch optimisé */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Preconnect critique */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(globalStructuredData)
          }}
        />
        
        {/* Favicon optimisé */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* Meta tags essentiels */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
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
}

export const dynamic = "force-dynamic";
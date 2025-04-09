import React from "react";
import { Metadata } from "next";
import "./globals.css";
import { Providers } from "./components/Providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Daznode - Learn Languages with AI",
    template: "%s | Daznode",
  },
  description:
    "Daznode is an innovative AI-powered language learning platform that helps you master new languages through personalized lessons and real-time feedback.",
  keywords: [
    "language learning",
    "AI tutor",
    "education",
    "languages",
    "artificial intelligence",
    "personalized learning",
  ],
  authors: [{ name: "Daznode Team" }],
  creator: "Inoval",
  publisher: "Inoval",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dazno.de"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      fr: "/fr",
    },
  },
  openGraph: {
    title: "Daznode - Learn Languages with AI",
    description: "Master new languages with personalized AI-powered lessons",
    url: "https://dazno.de",
    siteName: "Daznode",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daznode - Learn Languages with AI",
    description: "Master new languages with personalized AI-powered lessons",
    creator: "@Daznode",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

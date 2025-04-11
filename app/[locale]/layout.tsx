import { Metadata, Viewport } from "next";
import { locales } from "../i18n.config";
import { notFound } from "next/navigation";
import { Locale } from "../i18n.config.base";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "../components/Providers";
import Header from "../components/layout/Header";
import { Footer } from "../components/Footer";
import { siteConfig } from "../config/metadata";

// Pas besoin de force-dynamic pour le layout principal
// export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "Daznode - Votre Portail Lightning Network",
  description:
    "Découvrez Daznode, la plateforme qui simplifie la gestion de votre nœud Lightning Network.",
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  app: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  app,
  params: { locale },
}: RootLayoutProps) {
  // Vérifier la validité de la locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  let messages;
  try {
    // Charger les messages de manière asynchrone
    messages = (await import(`../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pt-16">
              {children}
              {app}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

import { Metadata, Viewport } from "next";
import { locales } from "@/i18n.config";
import { notFound } from "next/navigation";
import { Locale } from "@/i18n.config.base";
import { Inter } from "next/font/google";
import "@/globals.css";
import { Providers } from "@/components/providers/Providers";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/metadata";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

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

interface LocaleLayoutProps {
  children: React.ReactNode;
  app: React.ReactNode;
  auth: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  app,
  auth,
  params: { locale },
}: LocaleLayoutProps) {
  // Vérifier la validité de la locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  let messages;
  try {
    messages = await getMessages({ locale });
  } catch (error) {
    notFound();
  }

  return (
    <Providers>
      <NextIntlClientProvider messages={messages} locale={locale}>
        <div className="relative flex min-h-screen flex-col" lang={locale}>
          <Header />
          <main className="flex-1 pt-16">
            {auth}
            {app}
            {children}
          </main>
          <Footer />
        </div>
      </NextIntlClientProvider>
    </Providers>
  );
}

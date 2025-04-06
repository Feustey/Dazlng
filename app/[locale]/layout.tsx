import { metadata as siteConfig } from "../config/metadata";
import { Metadata, Viewport } from "next";
import ClientLayout from "../ClientLayout";
import "../globals.css";
import Navigation from "@/app/components/Navigation";
import { Footer } from "@/app/components/Footer";
import { NextIntlClientProvider } from "next-intl";
import { locales, defaultLocale } from "@/i18n.config";
import { notFound, redirect } from "next/navigation";
import { Locale } from "@/i18n.config.base";
import { headers } from "next/headers";
import { checkDatabaseConnection } from "@/app/lib/db";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: "DazNode",
      url: siteConfig.url,
    },
  ],
  creator: "DazNode",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@DazNode",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

async function getMessages(locale: string) {
  try {
    console.log(`Loading messages for locale: ${locale}`);

    // Charger les messages de base
    const baseMessages = await import(`../../messages/${locale}.json`);
    console.log("Base messages loaded");

    // Charger les messages spécifiques aux sections
    const sectionMessages = {
      home: await import(`../../public/locale/home/${locale}.json`).catch(
        (e) => {
          console.warn(`Failed to load home messages: ${e.message}`);
          return { default: {} };
        }
      ),
      about: await import(`../../public/locale/about/${locale}.json`).catch(
        (e) => {
          console.warn(`Failed to load about messages: ${e.message}`);
          return { default: {} };
        }
      ),
      recommendations: await import(
        `../../public/locale/recommendations/${locale}.json`
      ).catch((e) => {
        console.warn(`Failed to load recommendations messages: ${e.message}`);
        return { default: {} };
      }),
      dashboard: await import(
        `../../public/locale/dashboard/${locale}.json`
      ).catch((e) => {
        console.warn(`Failed to load dashboard messages: ${e.message}`);
        return { default: {} };
      }),
      auth: await import(`../../public/locale/auth/${locale}.json`).catch(
        (e) => {
          console.warn(`Failed to load auth messages: ${e.message}`);
          return { default: {} };
        }
      ),
      botIa: await import(`../../public/locale/bot-ia/${locale}.json`).catch(
        (e) => {
          console.warn(`Failed to load bot-ia messages: ${e.message}`);
          return { default: {} };
        }
      ),
    };

    // Fusionner tous les messages
    const messages = {
      ...baseMessages.default,
      ...sectionMessages.home.default,
      ...sectionMessages.about.default,
      ...sectionMessages.recommendations.default,
      ...sectionMessages.dashboard.default,
      ...sectionMessages.auth.default,
      ...sectionMessages.botIa.default,
    };

    console.log("All messages loaded successfully");
    return messages;
  } catch (error) {
    console.error("Error loading messages:", error);
    throw error; // Propager l'erreur au lieu de notFound()
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
  app,
}: {
  children: React.ReactNode;
  params: { locale: Locale };
  app: React.ReactNode;
}) {
  try {
    // Vérifier la connexion à la base de données
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error("Database connection failed");
      throw new Error("Database connection failed");
    }

    if (!locales.includes(locale)) {
      const headersList = headers();
      const pathname = headersList.get("x-pathname") || "";
      redirect(`/${defaultLocale}${pathname}`);
    }

    const messages = await getMessages(locale);
    if (!messages) {
      throw new Error("Failed to load messages");
    }

    return (
      <html lang={locale} suppressHydrationWarning>
        <body className="font-sans antialiased">
          <NextIntlClientProvider messages={messages} locale={locale}>
            <ClientLayout>
              <div className="flex min-h-screen flex-col">
                <Navigation />
                <main className="flex-1 pt-16">
                  <div className="flex-1">{children}</div>
                  {app}
                </main>
                <Footer />
              </div>
            </ClientLayout>
          </NextIntlClientProvider>
        </body>
      </html>
    );
  } catch (error) {
    console.error("Layout error:", error);
    // Afficher une page d'erreur au lieu de crasher
    return (
      <html lang={locale} suppressHydrationWarning>
        <body className="font-sans antialiased">
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600">
                Une erreur est survenue
              </h1>
              <p className="mt-2 text-gray-600">Veuillez réessayer plus tard</p>
            </div>
          </div>
        </body>
      </html>
    );
  }
}

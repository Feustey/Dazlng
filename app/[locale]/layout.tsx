import { Metadata, Viewport } from "next";
import ClientLayout from "../ClientLayout";
import "../globals.css";
import Navigation from "../components/Navigation";
import { Footer } from "../components/Footer";
import { locales, defaultLocale } from "../i18n.config";
import { redirect } from "next/navigation";
import { Locale } from "../i18n.config.base";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

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
  metadataBase: new URL("https://dazno.de"),
  title: {
    default: "DazNode - Lightning Node Manager",
    template: `%s | DazNode`,
  },
  description: "Gérez et surveillez votre nœud Lightning Network avec DazNode",
  keywords: ["Lightning Network", "Bitcoin", "Node Management", "DazNode"],
  authors: [
    {
      name: "DazNode",
      url: "https://dazno.de",
    },
  ],
  creator: "DazNode",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: "en_US",
    url: "https://dazno.de",
    title: "DazNode - Lightning Node Manager",
    description:
      "Gérez et surveillez votre nœud Lightning Network avec DazNode",
    siteName: "DazNode",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DazNode",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DazNode - Lightning Node Manager",
    description:
      "Gérez et surveillez votre nœud Lightning Network avec DazNode",
    images: ["/og-image.png"],
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

interface LayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LayoutProps) {
  try {
    // Vérifier la validité de la locale de manière asynchrone
    const validLocales = await Promise.resolve(locales);
    if (!validLocales.includes(locale)) {
      const headersList = await headers();
      const pathname = headersList.get("x-pathname") || "";
      redirect(`/${defaultLocale}${pathname}`);
    }

    // Charger les messages de manière asynchrone
    const messages = await import(`../messages/${locale}.json`)
      .then((module) => module.default)
      .catch(() => {
        console.error(`Failed to load messages for locale: ${locale}`);
        return {};
      });

    return (
      <Providers locale={locale} messages={messages}>
        <ClientLayout>
          <Navigation />
          <main className={inter.className}>{children}</main>
          <Footer />
        </ClientLayout>
      </Providers>
    );
  } catch (error) {
    console.error("Error in LocaleLayout:", error);
    throw error;
  }
}

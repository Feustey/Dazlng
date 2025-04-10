import { Metadata, Viewport } from "next";
import { locales, defaultLocale } from "../i18n.config";
import { redirect, notFound } from "next/navigation";
import { Locale } from "../i18n.config.base";
import { headers } from "next/headers";
import { Inter } from "next/font/google";
import "../globals.css";
import { Providers } from "../components/Providers";
import Header from "../components/layout/Header";
import { Footer } from "../components/Footer";

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
};

interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: Locale;
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  // Vérifier la validité de la locale
  if (!locales.includes(locale as Locale)) {
    const headersList = headers();
    const pathname = headersList.get("x-pathname") || "";
    redirect(`/${defaultLocale}${pathname}`);
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
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow pt-[80px]">{children}</div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

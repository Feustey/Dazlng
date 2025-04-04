import { Inter } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages } from "@/app/lib/get-messages";
import { Viewport } from "next";
import Header from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";
import { Suspense } from "react";
import { siteConfig } from "@/app/config/site";
import ClientLayout from "@/app/ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export const metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: ["Lightning Network", "Bitcoin", "Node Management", "DazLng"],
  authors: [
    {
      name: "DazLng",
      url: siteConfig.url,
    },
  ],
  creator: "DazLng",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@dazlng",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: { locale: string };
  app: React.ReactNode;
};

export default async function LocaleLayout({
  children,
  params: { locale },
  app,
}: LocaleLayoutProps) {
  let messages;
  try {
    messages = await getMessages(locale);
  } catch (_error) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ClientLayout>
            <div className="min-h-screen flex flex-col">
              <Suspense fallback={<div className="h-16 bg-background" />}>
                <Header />
              </Suspense>
              <main className="flex-1">
                <Suspense fallback={<div className="h-screen bg-background" />}>
                  {children}
                </Suspense>
              </main>
              <Suspense fallback={<div className="h-16 bg-background" />}>
                <Footer />
              </Suspense>
            </div>
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

"use client";

// Imports React
import { ReactNode } from "react";

// Imports de bibliothèques tierces
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";

// Imports de composants
import { ThemeProvider } from "../components/ThemeProvider";
import ClientLayout from "../ClientLayout";
import Navigation from "../components/Navigation";
import { Footer } from "../components/Footer";
import { Providers } from "./providers";

interface RootLayoutClientProps {
  children: React.ReactNode;
  locale: string;
  messages: any;
}

export default function RootLayoutClient({
  children,
  locale,
  messages,
}: RootLayoutClientProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div className="relative flex flex-col min-h-screen">
          <Navigation />
          <main className="flex-1">
            <Providers locale={locale} messages={messages}>
              <ClientLayout>{children}</ClientLayout>
            </Providers>
          </main>
          <Footer />
        </div>
        <Toaster position="top-center" />
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}

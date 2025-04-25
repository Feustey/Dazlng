"use client";

// Imports React
import { ReactNode } from "react";

// Imports de bibliothèques tierces
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";

// Imports de composants
import ClientLayout from "../../app/ClientLayout";
import Navigation from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
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

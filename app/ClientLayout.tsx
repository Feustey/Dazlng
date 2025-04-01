"use client";

import "./globals.css";
import Layout from "@/components/Layout";
import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { NodeProvider } from "@/contexts/NodeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { Squada_One } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";

const squadaOne = Squada_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-squada",
});

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={squadaOne.variable}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <LanguageProvider>
            <SettingsProvider>
              <NodeProvider>
                <Layout>{children}</Layout>
                <Toaster />
              </NodeProvider>
            </SettingsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

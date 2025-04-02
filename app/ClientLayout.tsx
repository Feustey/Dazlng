"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "./components/Layout";
import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "./contexts/SettingsContext";
import { NodeProvider } from "./contexts/NodeContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "./components/ui/sonner";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
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

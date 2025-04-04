"use client";

import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "@/app/contexts/SettingsContext";
import { NodeProvider } from "@/app/contexts/NodeContext";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { Toaster } from "@/app/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/app/components/ui/sonner";
import Header from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SettingsProvider>
        <NodeProvider>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-6">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
            <SonnerToaster />
          </AuthProvider>
        </NodeProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

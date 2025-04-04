"use client";

import { ThemeProvider } from "next-themes";
import { SettingsProvider } from "./contexts/SettingsContext";
import { Toaster } from "sonner";
import { LanguageProvider } from "./contexts/LanguageContext";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SettingsProvider>
        <LanguageProvider>
          <Toaster />
          {children}
        </LanguageProvider>
      </SettingsProvider>
    </ThemeProvider>
  );
}

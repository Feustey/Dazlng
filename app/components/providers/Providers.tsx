"use client";

// Imports React
import { useState, useEffect } from "react";

// Imports Next.js
import { useParams } from "next/navigation";

// Imports de bibliothèques tierces
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";

// Imports de configuration
import { locales, defaultLocale } from "../../i18n.config.base";

// Imports de contextes
import { AlertProvider } from "../../contexts/AlertContext";
import { AuthProvider } from "../../contexts/AuthContext";
import { Toaster } from "../ui/toaster";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<Record<string, any>>({});
  const params = useParams();
  const locale = (params.locale as string) || defaultLocale;

  // Vérifier si le locale est valide, sinon utiliser le locale par défaut
  const validLocale = (locales as readonly string[]).includes(locale)
    ? locale
    : defaultLocale;

  useEffect(() => {
    setMounted(true);
    // Charger les messages de manière dynamique côté client
    import(`../../messages/${validLocale}.json`)
      .then((module) => {
        setMessages(module.default);
      })
      .catch((error) => {
        console.error(
          `Erreur de chargement des messages pour ${validLocale}:`,
          error
        );
        setMessages({}); // Utiliser un objet vide en cas d'erreur
      });
  }, [validLocale]);

  if (!mounted) {
    return null;
  }

  return (
    <NextIntlClientProvider
      locale={validLocale}
      messages={messages}
      timeZone="Europe/Paris"
      onError={(error) => {
        console.warn("Intl error:", error.message);
      }}
    >
      <SessionProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AlertProvider>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </AlertProvider>
        </ThemeProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}

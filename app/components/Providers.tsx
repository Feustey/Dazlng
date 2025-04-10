"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { AlertProvider } from "../contexts/AlertContext";
import { AuthProvider } from "../contexts/AuthContext";
import { NextIntlClientProvider } from "next-intl";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { locales, defaultLocale } from "../i18n.config.base";

export function Providers({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Record<string, any>>({});
  const params = useParams();
  const locale = (params.locale as string) || defaultLocale;

  // Vérifier si le locale est valide, sinon utiliser le locale par défaut
  const validLocale = (locales as readonly string[]).includes(locale)
    ? locale
    : defaultLocale;

  useEffect(() => {
    // Charger les messages de manière dynamique côté client
    import(`../messages/${validLocale}.json`)
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
            <AuthProvider>{children}</AuthProvider>
          </AlertProvider>
        </ThemeProvider>
      </SessionProvider>
    </NextIntlClientProvider>
  );
}

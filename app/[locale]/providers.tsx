"use client";

// Imports React
import { ReactNode } from "react";

// Imports de bibliothèques tierces
import { NextIntlClientProvider } from "next-intl";

type ProvidersProps = {
  locale: string;
  messages: any;
  children: ReactNode;
};

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

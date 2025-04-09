"use client";

import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";

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

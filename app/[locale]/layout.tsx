import type { Metadata } from "next";
import { ReactNode } from "react";
// Importer les composants et CSS depuis la racine de app/
import ClientLayout from "../ClientLayout";
import "../globals.css";
// Nous gèrerons les métadonnées dynamiques plus tard si nécessaire
// import metadataBase from "../metadata";

// Importer le provider pour les messages côté client
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

type Props = {
  children: ReactNode;
  params: { locale: string };
  app: ReactNode;
};

// Note: Les métadonnées statiques exportées ici pourraient ne pas fonctionner
// comme attendu avec les locales. Il est souvent préférable de générer
// les métadonnées dynamiquement dans la page ou le layout.
// export const metadata: Metadata = metadataBase;

export default async function LocaleLayout({
  children,
  params: { locale },
  app,
}: Props) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>
            {app}
            {children}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

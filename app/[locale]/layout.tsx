import type { Metadata } from "next";
import { ReactNode } from "react";
import ClientLayout from "@/app/ClientLayout";
import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

type Props = {
  children: ReactNode;
  params: { locale: string };
  app: ReactNode;
};

// 📌 Si tu veux définir des métadonnées dynamiquement, fais-le ici
export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  return {
    title: locale === "fr" ? "Mon Application" : "My App",
    description:
      locale === "fr" ? "Bienvenue sur mon app" : "Welcome to my app",
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
  app,
}: Props) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound(); // 🚨 Si le fichier de langue n'existe pas, on affiche une page 404
  }

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>
            {children}
            {app}
          </ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import Header from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "fr" }];
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = (await import(`@/messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}

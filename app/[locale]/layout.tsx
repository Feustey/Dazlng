import { Inter } from 'next/font/google';
import '../globals.css';
import { Metadata } from 'next';
import ClientLayout from '../ClientLayout';
import { SupabaseProvider } from '../providers/SupabaseProvider';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { locales } from '@/i18n/settings';

const inter = Inter({ subsets: ['latin'] });

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

async function getMessages(locale: string) {
  try {
    return (await import(`@/i18n/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  const messages = await getMessages(locale);

  return {
    title: {
      default: messages.metadata.title,
      template: `%s | ${messages.metadata.title}`
    },
    description: messages.metadata.description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
    openGraph: {
      type: 'website',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      title: messages.metadata.title,
      description: messages.metadata.description,
      siteName: 'DazNode'
    }
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params: { locale }
}: Props) {
  // Validate locale
  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <SupabaseProvider>
            <ClientLayout>
              {children}
            </ClientLayout>
          </SupabaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
} 
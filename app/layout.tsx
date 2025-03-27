import './globals.css';
import type { Metadata } from 'next';
import { Layout } from '@/components/layout';
import { LanguageProvider } from '@/lib/language-context';

export const metadata: Metadata = {
  title: 'Lightning Node Manager',
  description: 'Monitor and manage your Lightning Network node',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <LanguageProvider>
          <Layout>{children}</Layout>
        </LanguageProvider>
      </body>
    </html>
  );
}
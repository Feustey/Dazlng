import './globals.css';
import type { Metadata } from 'next';
import { Layout } from '@/components/layout';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/lib/language-context';
import { SettingsProvider } from '@/contexts/SettingsContext';

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
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <SettingsProvider>
              <Layout>{children}</Layout>
            </SettingsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
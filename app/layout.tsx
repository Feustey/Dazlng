import './globals.css';
import type { Metadata } from 'next';
import Layout from '@/components/layout';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/lib/language-context';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { NodeProvider } from '@/contexts/NodeContext';
import { Squada_One } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import { Logo } from "@/components/Logo"; // 'L' majuscule

const squadaOne = Squada_One({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-squada',
});

export const metadata: Metadata = {
  title: 'DazLng - Lightning Node Manager',
  description: 'Monitor and manage your Lightning Network node',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={squadaOne.variable}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <SettingsProvider>
              <NodeProvider>
                <Layout>{children}</Layout>
                <Toaster />
              </NodeProvider>
            </SettingsProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

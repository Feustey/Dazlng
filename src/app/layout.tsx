import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { NodeProvider } from '@/contexts/NodeContext';
import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'DazLng - Tableau de bord Lightning Network',
  description: 'Optimisez votre nœud Lightning Network avec des analyses en temps réel et des recommandations intelligentes.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SettingsProvider>
            <NodeProvider>
              <Header />
              <main className="min-h-screen bg-white dark:bg-gray-900">
                {children}
              </main>
              <Toaster />
            </NodeProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 
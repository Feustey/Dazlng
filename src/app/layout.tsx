import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { NodeProvider } from '@/contexts/NodeContext';
import Header from '@/components/Header';
import Footer from '@/app/components/Footer';
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
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 bg-background">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
            </NodeProvider>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
} 
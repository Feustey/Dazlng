import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/shared/layout/Header';
import Footer from '@/components/shared/layout/Footer';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DazNode',
  description: 'Votre plateforme DazNode',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={
          inter.className +
          ' bg-gradient-dazno text-[#E5E5E5] min-h-screen flex flex-col font-sans antialiased'
        }
      >
        <ClientLayout>
          {children}
        </ClientLayout>
        <Footer />
      </body>
    </html>
  );
} 
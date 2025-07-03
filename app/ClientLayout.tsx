"use client";
import { usePathname } from "next/navigation";
import CustomHeader from "@/components/shared/ui/CustomHeader";
import ModernLayout from "@/components/shared/layout/ModernLayout";
import PerformanceProvider from './PerformanceProvider';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import React, { ReactNode, useEffect } from 'react';
import { initSupabaseCookiesFix } from '@/lib/supabase-cookies-fix';

// Footer chargé dynamiquement avec skeleton optimisé
const Footer = dynamic(() => import('@/components/Footer'), { 
  loading: () => (
    <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    </div>
  ),
  ssr: false // Désactiver SSR pour éviter les problèmes d'hydratation
});

export interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Initialiser le fix des cookies Supabase au montage
  useEffect(() => {
    initSupabaseCookiesFix();
  }, []);

  // Pages qui masquent le header
  const hideHeader = pathname?.startsWith("/checkout") || 
                    pathname?.startsWith("/auth/login") || 
                    pathname?.startsWith("/user") ||
                    pathname?.startsWith("/admin");
  
  // Pages qui utilisent le layout full-width (largeur complète)
  const isFullWidth = pathname === "/" || 
                     pathname?.startsWith("/token-for-good") ||
                     pathname?.startsWith("/dazbox") ||
                     pathname?.startsWith("/daznode") ||
                     pathname?.startsWith("/dazpay") ||
                     pathname?.startsWith("/dazflow");

  // Pages qui utilisent le nouveau design moderne
  const useModernLayout = [
    "/",
    "/token-for-good",
    "/about",
    "/contact",
    "/dazbox",
    "/daznode", 
    "/dazpay",
    "/dazflow"
  ].includes(pathname || "");

  // Configuration du contenu principal avec largeur optimisée
  const content = (
    <div className="flex flex-col min-h-screen w-full">
      {!hideHeader && <CustomHeader />}
      <main className={`flex-1 w-full ${
        isFullWidth 
          ? 'max-w-none px-0' // Largeur complète sans contraintes
          : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8' // Largeur contrainte avec padding
      } ${
        !hideHeader && !isFullWidth && !pathname?.startsWith('/user') 
          ? 'pt-20' 
          : ''
      }`}>
        {children}
      </main>
      <Footer />
    </div>
  );

  // Configuration du Toaster optimisée
  const toasterConfig = {
    position: "top-right" as const,
    toastOptions: {
      duration: 4000,
      style: {
        background: '#363636',
        color: '#fff',
        borderRadius: '12px',
        fontSize: '14px',
        padding: '16px',
        maxWidth: '400px',
      },
      success: {
        duration: 3000,
        iconTheme: {
          primary: '#4ade80',
          secondary: '#fff',
        },
      },
      error: {
        duration: 5000,
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      },
    },
  };

  if (useModernLayout) {
    return (
      <PerformanceProvider>
        <ModernLayout 
          withGradientBg={pathname === "/" || pathname === "/token-for-good"}
          withAnimatedCircles={pathname === "/"}
        >
          {content}
        </ModernLayout>
        <Toaster {...toasterConfig} />
      </PerformanceProvider>
    );
  }

  return (
    <PerformanceProvider>
      {content}
      <Toaster {...toasterConfig} />
    </PerformanceProvider>
  );
};

export default ClientLayout;


"use client";
import { usePathname } from "next/navigation";
import CustomHeader from "@/components/shared/ui/CustomHeader";
import ModernLayout from "@/components/shared/layout/ModernLayout";
import PerformanceProvider from './PerformanceProvider';
import { Toaster } from 'react-hot-toast';
import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

const Footer = dynamic(() => import('@/components/Footer'), { loading: () => <div className="h-40 bg-gray-100"></div> });

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/checkout") || 
                    pathname?.startsWith("/auth/login") || 
                    pathname?.startsWith("/user");
  
  // Pages qui utilisent le layout full-width comme la home
  const isFullWidth = pathname === "/" || 
                     pathname?.startsWith("/token-for-good") ||
                     pathname?.startsWith("/dazbox") ||
                     pathname?.startsWith("/daznode") ||
                     pathname?.startsWith("/dazpay");

  // Pages qui utilisent le nouveau design moderne
  const useModernLayout = [
    "/",
    "/token-for-good",
    "/about",
    "/contact",
    "/dazbox",
    "/daznode", 
    "/dazpay"
  ].includes(pathname || "");

  const content = (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <CustomHeader />}
      <main className={`flex-1 w-full ${isFullWidth ? '' : 'max-w-5xl mx-auto'} ${isFullWidth ? '' : 'px-4 sm:px-8 py-4 sm:py-8'} ${!hideHeader && !isFullWidth && !pathname?.startsWith('/user') ? 'pt-20' : ''}`}>
        {children}
      </main>
      <Footer />
    </div>
  );

  if (useModernLayout) {
    return (
      <PerformanceProvider>
        <ModernLayout 
          withGradientBg={pathname === "/" || pathname === "/token-for-good"}
          withAnimatedCircles={pathname === "/"}
        >
          {content}
        </ModernLayout>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
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
          }}
        />
      </PerformanceProvider>
    );
  }

  return (
    <PerformanceProvider>
      {content}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
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
        }}
      />
    </PerformanceProvider>
  );
};

export default ClientLayout; 
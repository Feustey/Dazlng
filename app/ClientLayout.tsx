"use client";
import { usePathname } from "next/navigation";
import CustomHeader from "@/components/shared/ui/CustomHeader";
import ModernLayout from "@/components/shared/layout/ModernLayout";
import PerformanceProvider from './PerformanceProvider';
import dynamic from 'next/dynamic';
import React, { ReactNode } from 'react';

const Footer = dynamic(() => import('@/components/Footer'), { loading: () => <div className="h-40 bg-gray-100"></div> });

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/checkout");
  const isFullWidth = pathname === "/" || pathname?.startsWith("/token-for-good");

  // Pages qui utilisent le nouveau design moderne
  const useModernLayout = [
    "/",
    "/token-for-good",
    "/about",
    "/contact"
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
      </PerformanceProvider>
    );
  }

  return (
    <PerformanceProvider>
      {content}
    </PerformanceProvider>
  );
};

export default ClientLayout; 
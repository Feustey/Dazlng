"use client";
import { usePathname } from "next/navigation";
import CustomHeader from "@/components/shared/ui/CustomHeader";
import ModernLayout from "@/components/shared/layout/ModernLayout";
import PerformanceProvider from "./PerformanceProvider";
import { Toaster } from "react-hot-toast";
import dynamic from "next/dynamic";
import React, { ReactNode, useEffect, useMemo } from "react";
import { initSupabaseCookiesFix } from "@/lib/supabase-cookies-fix";

// Footer optimisé avec lazy loading intelligent
const Footer = dynamic(() => import("@/components/Footer"), { 
  loading: () => (
    <div>
      <div>
        <div className="h-6 bg-gray-200 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  ),
  ssr: false
});

export interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    initSupabaseCookiesFix();
  }, []);

  // Optimisation avec useMemo pour éviter les recalculs
  const layoutConfig = useMemo(() => {
    const hideHeader = pathname?.startsWith("/checkout") || 
                      pathname?.startsWith("/auth/login") || 
                      pathname?.startsWith("/user") ||
                      pathname?.startsWith("/admin");
    
    const isFullWidth = pathname === "/" || 
                       pathname?.startsWith("/token-for-good") ||
                       pathname?.startsWith("/dazbox") ||
                       pathname?.startsWith("/daznode") ||
                       pathname?.startsWith("/dazpay") ||
                       pathname?.startsWith("/dazflow");

    const useModernLayout = [
      "/", "/token-for-good", "/about", "/contact", "/dazbox", "/daznode", "/dazpay", "/dazflow"
    ].includes(pathname || "");

    return { hideHeader, isFullWidth, useModernLayout };
  }, [pathname]);

  const { hideHeader, isFullWidth, useModernLayout } = layoutConfig;

  // Configuration du contenu optimisée
  const content = (
    <div>
      {!hideHeader && <CustomHeader />}
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );

  // Toaster optimisé
  const toasterConfig = {
    position: "top-right" as const,
    toastOptions: {
      duration: 4000,
      style: {
        background: "#363636",
        color: "#fff",
        borderRadius: "12px",
        fontSize: "14px",
        padding: "16px",
        maxWidth: "400px"
      },
      success: { duration: 3000 },
      error: { duration: 5000 }
    }
  };

  if (useModernLayout) {
    return (
      <PerformanceProvider>
        <ModernLayout>
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
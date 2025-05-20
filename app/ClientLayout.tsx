"use client";
import { usePathname } from "next/navigation";
import CustomHeader from "@/components/shared/ui/CustomHeader";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/checkout");
  // Adapter la largeur de contenu selon la page
  const isFullWidth = pathname === "/" || pathname?.startsWith("/token-for-good");

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <CustomHeader />}
      <main className={`flex-1 w-full ${isFullWidth ? '' : 'max-w-5xl mx-auto'} px-4 sm:px-8 py-4 sm:py-8`}>
        {children}
      </main>
      <Footer />
    </div>
  );
} 
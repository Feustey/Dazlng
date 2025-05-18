"use client";
import { usePathname } from "next/navigation";
import Header from "@/components/shared/layout/Header";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideHeader = pathname?.startsWith("/checkout");

  return (
    <>
      {!hideHeader && <Header />}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-8">
        {children}
      </main>
    </>
  );
} 
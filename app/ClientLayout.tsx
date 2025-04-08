"use client";

import { SettingsProvider } from "./contexts/SettingsContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Nettoyage lors du démontage
    return () => {
      setMounted(false);
    };
  }, []);

  // Ne rendre le contenu que lorsque le composant est monté
  if (!mounted) {
    return null;
  }

  return (
    <>
      <SettingsProvider>
        <LanguageProvider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </LanguageProvider>
      </SettingsProvider>
    </>
  );
}

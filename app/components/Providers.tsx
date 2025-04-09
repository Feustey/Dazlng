"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "./ThemeProvider";
import { AlertProvider } from "../contexts/AlertContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="data-theme"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="daznode-theme"
      >
        <AlertProvider>{children}</AlertProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

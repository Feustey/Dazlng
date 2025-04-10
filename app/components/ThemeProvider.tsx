"use client";

// Imports Next.js
import Script from "next/script";
import React from "react";

// Imports de bibliothèques tierces
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <>
      <Script id="theme-script" strategy="afterInteractive">
        {`
          try {
            const theme = localStorage.getItem('daznode-theme') || 'system';
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            const currentTheme = theme === 'system' ? systemTheme : theme;
            document.documentElement.setAttribute('data-theme', currentTheme);
            document.documentElement.classList.add(currentTheme);
          } catch (e) {
            console.error('Error setting theme:', e);
          }
        `}
      </Script>
      <NextThemesProvider
        attribute="data-theme"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="daznode-theme"
        {...props}
      >
        {children}
      </NextThemesProvider>
    </>
  );
}

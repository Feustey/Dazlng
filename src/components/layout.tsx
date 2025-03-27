'use client';

import React from 'react';
import Header from './Header';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/lib/language-context';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Header />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
} 
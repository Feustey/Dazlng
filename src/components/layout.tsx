'use client';

import React from 'react';
import Header from './Header';
import { Toaster } from './ui/toaster';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Toaster />
    </div>
  );
} 
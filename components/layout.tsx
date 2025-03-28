"use client";

import { useState } from "react";
import { Bolt, Activity, MessageCircle, Settings, Menu, PlayCircle, Info, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LanguageSelector } from "@/components/language-selector";
import { Footer } from "@/components/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={cn(
            "fixed left-0 top-0 z-40 h-screen w-64 transform bg-background transition-transform duration-200 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center border-b px-6">
            <Bolt className="h-6 w-6" />
            <span className="ml-2 text-lg font-bold">DazLng -Lightning Manager</span>
          </div>
          <nav className="space-y-1 p-4">
            <Link href="/">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Activity className="mr-2 h-4 w-4" />
                Overview
              </Button>
            </Link>
            <Link href="/actions">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <PlayCircle className="mr-2 h-4 w-4" />
                Actions
              </Button>
            </Link>
            <Link href="/channels">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Bolt className="mr-2 h-4 w-4" />
                Channels
              </Button>
            </Link>
            <Link href="/bot-ia">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Bot className="mr-2 h-4 w-4" />
                Bot IA
              </Button>
            </Link>
            <Link href="/messages">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Messages
              </Button>
            </Link>
            <Link href="/settings">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Info className="mr-2 h-4 w-4" />
                À propos
              </Button>
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className={cn("flex-1", isSidebarOpen ? "ml-64" : "ml-0")}>
          <header className="flex h-16 items-center border-b px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <div className="ml-auto">
              <LanguageSelector />
            </div>
          </header>
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
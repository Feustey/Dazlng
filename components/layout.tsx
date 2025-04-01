"use client";

import { useState } from "react";
import {
  Bolt,
  Activity,
  MessageCircle,
  Settings,
  Menu,
  Info,
  Bot,
  Search,
  Network,
  HelpCircle,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "@/components/Logo";
import Footer from "@/components/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    if (!searchValue.trim()) return; // ne rien faire si champ vide
    console.log("Recherche pour:", searchValue);
    // Tu peux ici déclencher une vraie navigation ou un filtre
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out border-r bg-background",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-16 items-center border-b px-6 gap-2">
            <Logo className="h-12" />
            <span className="text-sm font-medium text-muted-foreground hidden md:block">
              Lightning Node Manager
            </span>
          </div>

          <nav className="space-y-1.5 p-4">
            <Link
              href="/"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Bolt className="mr-3 h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/channels"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Activity className="mr-3 h-5 w-5" />
              Channels
            </Link>
            <Link
              href="/network"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Network className="mr-3 h-5 w-5" />
              Network
            </Link>
            <Link
              href="/messages"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <MessageCircle className="mr-3 h-5 w-5" />
              Messages
            </Link>
            <Link
              href="/bot-ia"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Bot className="mr-3 h-5 w-5" />
              Bot IA
            </Link>
            <Link
              href="/review"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Star className="mr-3 h-5 w-5" />
              Review
            </Link>
            <Link
              href="/settings"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </Link>
            <Link
              href="/help"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <HelpCircle className="mr-3 h-5 w-5" />
              Help
            </Link>
            <Link
              href="/about"
              className="flex items-center rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              <Info className="mr-3 h-5 w-5" />
              About
            </Link>
          </nav>
        </aside>

        {/* Main content */}
        <div className={cn("flex-1", isSidebarOpen ? "ml-64" : "ml-0")}>
          <header className="flex h-16 items-center border-b px-6 gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>

            <div className="md:hidden">
              <Logo className="h-8" />
            </div>

            {/* SearchBar corrigée */}
            <div className="relative flex-1 max-w-xl ml-auto">
              <input
                type="text"
                placeholder="Rechercher un pubkey..."
                className="w-full pl-4 pr-10 py-2 border rounded-full 
                         focus:outline-none focus:ring-2 focus:ring-primary
                         font-mono text-sm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2"
                onClick={handleSearch}
                type="button"
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
      <Footer />
    </div>
  );
}

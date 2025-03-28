"use client";

import { useState } from "react";
import { Bolt, Activity, MessageCircle, Settings, Menu, PlayCircle, Info, Bot, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Logo } from "@/components/logo";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    // Logique de recherche ici
    console.log("Recherche pour:", searchValue);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
   <div className="flex h-16 items-center border-b px-6 gap-2">
  <Logo className="h-12" />
  <span className="text-sm font-medium text-muted-foreground hidden md:block">
    Lightning Node Manager
  </span>
</div>
       

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

        <div className="md:hidden"> {/* Visible seulement sur mobile */}
            <Logo className="h-8" />
        </div>

            {/* Barre de recherche */}
            <div className="relative flex-1 max-w-xl ml-auto">
              <input
                type="text"
                placeholder="Rechercher un pubkey..."
                className="w-full pl-4 pr-10 py-2 border rounded-full 
                         focus:outline-none focus:ring-2 focus:ring-primary
                         font-mono text-sm"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 text-muted-foreground" />
              </Button>
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

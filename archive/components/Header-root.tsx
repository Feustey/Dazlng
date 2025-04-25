"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  Home,
  Zap,
  Network,
  BarChart2,
  BookOpen,
  HelpCircle,
  LogIn,
} from "lucide-react";
import { AccountMenu } from "@/components/auth/AccountMenu";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "../ui/LanguageSelector";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Header() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    {
      name: "Daznode",
      href: "/daznode",
      icon: Network,
    },
    {
      name: "Daz-IA",
      href: "/daz-ia",
      icon: Zap,
    },

    {
      name: t("Header.learn"),
      href: "/learn",
      icon: BookOpen,
    },
  ];

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`bg-background/95 backdrop-blur-xl border-b border-border transition-all duration-300 ${
          isScrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            {/* Logo + nom */}
            <Link href={`/${locale}`} className="flex items-center space-x-3">
              <img
                src="/images/logo-icon.svg"
                alt="Daznode logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold text-foreground hidden sm:inline">
                Daznode
              </span>
            </Link>

            {/* Navigation desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={`/${locale}${item.href}`}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent/10",
                    pathname === `/${locale}${item.href}`
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-1">
              <LanguageSelector />

              <Link
                href={`/${locale}/help`}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t("Header.help")}
              >
                <HelpCircle className="w-5 h-5" />
              </Link>

              <button
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t("Header.messages")}
              >
                <Bell className="w-5 h-5" />
              </button>

              {session ? (
                <AccountMenu />
              ) : (
                <Link
                  href={`/${locale}/auth/signin`}
                  className={cn(
                    buttonVariants({ variant: "gradient", size: "sm" }),
                    "flex items-center space-x-2"
                  )}
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t("Header.login")}</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

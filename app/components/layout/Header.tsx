"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
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
  Menu,
} from "lucide-react";
import { SimpleLogo } from "../SimpleLogo";
import { AccountMenu } from "../AccountMenu";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "../LanguageSelector";

export default function Header() {
  const { t } = useTranslation();
  const locale = useLocale();
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Navigation items avec icônes
  const navItems = [
    {
      href: `/${locale}`,
      label: t("header.navigation.dashboard"),
      icon: <Home className="w-5 h-5" />,
    },
    {
      href: `/${locale}/daz-ia`,
      label: t("header.navigation.dazia"),
      icon: <Zap className="w-5 h-5" />,
    },
    {
      href: `/${locale}/network`,
      label: t("header.navigation.network"),
      icon: <Network className="w-5 h-5" />,
    },
    {
      href: `/${locale}/channels`,
      label: t("header.navigation.channels"),
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      href: `/${locale}/learn`,
      label: t("header.navigation.learn"),
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  // Gestion du scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fonction pour changer de langue
  const toggleLocale = () => {
    const newLocale = locale === "fr" ? "en" : "fr";
    router.push(pathname.replace(`/${locale}`, `/${newLocale}`));
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <AnimatePresence>
        {/* Première ligne - visible uniquement quand on n'a pas scrollé */}
        {!isScrolled && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-background/80 backdrop-blur-xl border-b border-border"
          >
            <div className="container mx-auto px-4">
              <div className="h-16 flex items-center justify-between">
                <Link
                  href={`/${locale}`}
                  className="flex items-center space-x-4"
                >
                  <SimpleLogo className="w-8 h-8" />
                </Link>

                <div className="flex items-center space-x-1">
                  <LanguageSelector />

                  <Link
                    href={`/${locale}/help`}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={t("header.navigation.help")}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </Link>

                  <button
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={t("header.actions.notifications")}
                  >
                    <Bell className="w-5 h-5" />
                  </button>

                  {session ? (
                    <AccountMenu />
                  ) : (
                    <Link
                      href={`/${locale}/auth/signin`}
                      className="flex items-center space-x-2 btn-gradient py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{t("header.actions.login")}</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Deuxième ligne - navigation toujours visible et sticky */}
        <div
          className={`bg-background/95 backdrop-blur-xl border-b border-border sticky top-0 transition-all duration-300 ${isScrolled ? "shadow-md" : ""}`}
        >
          <div className="container mx-auto px-4">
            <div className="h-16 flex items-center justify-between">
              {/* Logo visible uniquement quand on a scrollé */}
              {isScrolled && (
                <Link
                  href={`/${locale}`}
                  className="flex items-center space-x-4"
                >
                  <SimpleLogo className="w-8 h-8" />
                </Link>
              )}

              {/* Navigation desktop */}
              <nav
                className={`hidden md:flex items-center space-x-1 ${isScrolled ? "" : "w-full"}`}
              >
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors hover:bg-accent/10 ${
                      pathname === item.href
                        ? "text-primary font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>

              {/* Contrôles de droite visibles uniquement quand on a scrollé */}
              {isScrolled && (
                <div className="flex items-center space-x-1">
                  <LanguageSelector />

                  <Link
                    href={`/${locale}/help`}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={t("header.navigation.help")}
                  >
                    <HelpCircle className="w-5 h-5" />
                  </Link>

                  <button
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={t("header.actions.notifications")}
                  >
                    <Bell className="w-5 h-5" />
                  </button>

                  {session ? (
                    <AccountMenu />
                  ) : (
                    <Link
                      href={`/${locale}/auth/signin`}
                      className="flex items-center space-x-2 btn-gradient py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{t("header.actions.login")}</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-accent rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-background border-b border-border"
            >
              <nav className="container mx-auto px-4 py-4">
                <div className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </header>
  );
}

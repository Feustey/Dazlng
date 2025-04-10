"use client";

import * as React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { SimpleLogo } from "./SimpleLogo";
import { useSession } from "next-auth/react";
import { AccountMenu } from "./AccountMenu";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { AuthenticationWrapper } from "./auth/AuthenticationWrapper";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);
  const t = useTranslations("Header");
  const locale = useLocale();
  const { data: session } = useSession();
  const pathname = usePathname() || "";

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const openLoginModal = () => {
    setLoginModalOpen(true);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const isActive = (path: string) => pathname.startsWith(`/${locale}${path}`);

  return (
    <AuthenticationWrapper
      showLoginModal={loginModalOpen}
      onCloseModal={() => setLoginModalOpen(false)}
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 h-[var(--header-height)] flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center">
            <SimpleLogo className="h-8 w-auto animate-fade-in" />
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={`/${locale}/learn`}
              className={`nav-link ${isActive("/learn") ? "nav-link-active" : ""}`}
            >
              {t("learn")}
            </Link>
            {session ? (
              <AccountMenu />
            ) : (
              <Button
                onClick={openLoginModal}
                variant="ghost"
                className="nav-link"
              >
                {t("login")}
              </Button>
            )}
          </nav>

          {/* Menu Mobile Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent text-foreground transition-colors duration-200"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-[var(--header-height)] left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 animate-slide-down">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              <Link
                href={`/${locale}/learn`}
                className={`nav-link ${isActive("/learn") ? "nav-link-active" : ""}`}
                onClick={toggleMenu}
              >
                {t("learn")}
              </Link>
              {session ? (
                <div className="py-2">
                  <AccountMenu />
                </div>
              ) : (
                <Button
                  onClick={openLoginModal}
                  variant="ghost"
                  className="justify-start p-0 h-auto font-normal text-base"
                >
                  {t("login")}
                </Button>
              )}
            </div>
          </div>
        )}
      </header>
    </AuthenticationWrapper>
  );
}

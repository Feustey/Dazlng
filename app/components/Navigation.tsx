"use client";

import Link from "next/link";
import { useAuth } from "@/app/hooks/useAuth";
import { Button } from "@/components/ui/button";
import UserMenu from "@/app/components/UserMenu";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const { isAuthenticated } = useAuth();
  const t = useTranslations("navigation");
  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  return (
    <nav className="bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href={`/${locale}`} className="flex items-center">
              <span className="text-xl font-bold text-primary">DazLng</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link href={`/${locale}/auth`}>
                <Button variant="outline">{t("login")}</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

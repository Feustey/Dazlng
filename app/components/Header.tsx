"use client";

import React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  Zap as ZapIcon,
  Activity as ActivityIcon,
  Network as NetworkIcon,
  Star as StarIcon,
  Bot as BotIcon,
  HelpCircle as HelpIcon,
  Settings as SettingsIcon,
} from "lucide-react";
import { Logo } from "./Logo";
import { SettingsMenu } from "@/components/SettingsMenu";
import { useAuth } from "@/app/contexts/AuthContext";

const menuItems = [
  { key: "channels", href: "/channels", Icon: ActivityIcon },
  { key: "network", href: "/network", Icon: NetworkIcon },
  { key: "review", href: "/review", Icon: StarIcon },
  { key: "dazIA", href: "/daz-ia", Icon: BotIcon },
];

const Header = () => {
  const t = useTranslations("Header");
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const currentLocale =
    typeof params.locale === "string" ? params.locale : "fr";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link
          href={`/${currentLocale}`}
          className="flex items-center space-x-2"
        >
          <Logo className="h-8 w-auto" />
        </Link>
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-4">
            <Link
              href={`/${currentLocale}/channels`}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {t("channels")}
            </Link>
            <Link
              href={`/${currentLocale}/network`}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {t("network")}
            </Link>
            <Link
              href={`/${currentLocale}/review`}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {t("review")}
            </Link>
            <Link
              href={`/${currentLocale}/daz-ia`}
              className="text-sm font-medium transition-colors hover:text-foreground/80"
            >
              {t("dazIA")}
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <SettingsMenu />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

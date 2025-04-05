"use client";

import * as React from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  Activity as ActivityIcon,
  BookOpen as LearnIcon,
  HelpCircle as HelpIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  Zap as ZapIcon,
  User as UserIcon,
} from "lucide-react";
import { SimpleLogo } from "./SimpleLogo";
import { SettingsMenu } from "@/components/SettingsMenu";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const menuItems = [
  { key: "channels", href: "/channels", Icon: ActivityIcon },
  { key: "learn", href: "/learn", Icon: LearnIcon },
  { key: "review", href: "/review", Icon: StarIcon },
];

const Header = () => {
  const t = useTranslations("Header");
  const params = useParams();
  const { isAuthenticated, user, logout } = useAuth();
  const currentLocale =
    typeof params.locale === "string" ? params.locale : "fr";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-background/95 dark:border-border">
      <div className="container flex h-14 items-center">
        <Link
          href={`/${currentLocale}`}
          className="flex items-center space-x-2"
        >
          <SimpleLogo className="h-15 w-auto" />
        </Link>
        <nav className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center space-x-4">
            <Link
              href={`/${currentLocale}/channels`}
              className="text-sm font-medium transition-colors hover:text-foreground/80 dark:text-foreground/90 dark:hover:text-foreground"
            >
              {t("channels")}
            </Link>
            <Link
              href={`/${currentLocale}/learn`}
              className="text-sm font-medium transition-colors hover:text-foreground/80 dark:text-foreground/90 dark:hover:text-foreground"
            >
              {t("learn")}
            </Link>
            <Link
              href={`/${currentLocale}/review`}
              className="text-sm font-medium transition-colors hover:text-foreground/80 dark:text-foreground/90 dark:hover:text-foreground"
            >
              {t("review")}
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            <SettingsMenu />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.email || ""} />
                      <AvatarFallback>
                        <UserIcon className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.email}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.pubkey}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${currentLocale}/profile`}>
                      {t("profile")}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${currentLocale}/node`}>{t("myNode")}</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    {t("logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href={`/${currentLocale}/login`}>
                <Button variant="outline" size="sm">
                  {t("login")}
                </Button>
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;

"use client";

import * as React from "react";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { LogOut, Settings } from "lucide-react";

import { useAuth } from "@/app/contexts/AuthContext";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { Button } from "@/app/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

export function SettingsMenu() {
  const { setTheme, theme } = useTheme();
  const { language: currentLocale, setLanguage } = useLanguage();
  const { isAuthenticated, logout } = useAuth();
  const t = useTranslations("Settings");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-9 px-0"
          aria-label={t("title")}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background border shadow-lg"
      >
        <div className="px-2 py-1.5 text-sm font-semibold">
          {t("language.label")}
        </div>
        <DropdownMenuItem onClick={() => setLanguage("fr")}>
          <span className={currentLocale === "fr" ? "font-bold" : ""}>
            {t("language.options.fr")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          <span className={currentLocale === "en" ? "font-bold" : ""}>
            {t("language.options.en")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-sm font-semibold">
          {t("theme.label")}
        </div>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <span className={theme === "light" ? "font-bold" : ""}>
            {t("theme.options.light")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <span className={theme === "dark" ? "font-bold" : ""}>
            {t("theme.options.dark")}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <span className={theme === "system" ? "font-bold" : ""}>
            {t("theme.options.system")}
          </span>
        </DropdownMenuItem>
        {isAuthenticated && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              {t("logout")}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

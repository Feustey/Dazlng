"use client";

import { useTheme } from "next-themes";
import { useLanguage } from "../hooks/useLanguage";
import { useAuth } from "../hooks/useAuth";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";

export default function SettingsMenu() {
  const { setTheme, theme } = useTheme();
  const { language: currentLocale, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const t = useTranslations("Settings");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Paramètres</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {t("theme.light")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {t("theme.dark")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {t("theme.system")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("fr")}>
          {t("language.french")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("en")}>
          {t("language.english")}
        </DropdownMenuItem>
        {user && (
          <DropdownMenuItem onClick={logout}>{t("logout")}</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

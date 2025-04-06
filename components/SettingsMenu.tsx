import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Settings } from "lucide-react";

import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Switch } from "@ui/switch";

export function SettingsMenu() {
  const t = useTranslations("Header");
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1];
  const [currency, setCurrency] = useState<"btc" | "sats">("sats");

  const currentLocale = pathname?.split("/")[1] || "fr";
  const newLocale = currentLocale === "fr" ? "en" : "fr";

  const handleLanguageChange = () => {
    const newPath = pathname?.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath ? `/${locale}${newPath}` : `/${locale}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 sm:w-64">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-medium leading-none">{t("settings")}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-between cursor-default py-3">
          <span className="text-sm sm:text-base">{t("language")}</span>
          <Switch
            checked={currentLocale === "en"}
            onCheckedChange={handleLanguageChange}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-between cursor-default py-3">
          <span className="text-sm sm:text-base">{t("theme")}</span>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center justify-between cursor-default py-3">
          <span className="text-sm sm:text-base">{t("currency")}</span>
          <Switch
            checked={currency === "btc"}
            onCheckedChange={(checked) => setCurrency(checked ? "btc" : "sats")}
          />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

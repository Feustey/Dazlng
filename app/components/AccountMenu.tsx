"use client";

import { useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";

export function AccountMenu() {
  const { data: session } = useSession();
  const locale = useLocale();
  const { t } = useTranslation();

  if (!session) return null;

  return (
    <DropdownMenu>
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col space-y-1">
          <p className="text-sm font-medium leading-none">
            {session.user.name || session.user.email}
          </p>
          <p className="text-xs leading-none text-muted-foreground">
            {session.user.email}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      {/* Services principaux */}
      <DropdownMenuItem asChild>
        <Link href={`/${locale}/daznode`}>
          {t("header.navigation.daznode")}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/${locale}/network`}>
          {t("header.navigation.network")}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/${locale}/channels`}>
          {t("header.navigation.channels")}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/${locale}/daz-ia`}>{t("header.navigation.dazia")}</Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {/* Paramètres du compte */}
      <DropdownMenuItem asChild>
        <Link href={`/${locale}/profile`}>{t("header.actions.profile")}</Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href={`/${locale}/settings`}>{t("header.actions.settings")}</Link>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {/* Déconnexion */}
      <DropdownMenuItem
        className="text-red-600"
        onClick={() => signOut({ callbackUrl: `/${locale}` })}
      >
        {t("header.actions.logout")}
      </DropdownMenuItem>
    </DropdownMenu>
  );
}

"use client";

import { useSession, signOut } from "next-auth/react";
import { useParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

export function AccountMenu() {
  const { data: session } = useSession();
  const params = useParams();
  const t = useTranslations("Account");
  const locale = (params?.locale as string) || "fr";

  if (!session?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2">
          <User className="h-5 w-5" />
          <span>{t("myAccount")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
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
          <Link href={`/${locale}/daznode`}>Daznode</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/network`}>Network</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/channels`}>{t("channels")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/daz-ia`}>Daz-IA</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Paramètres du compte */}
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/profile`}>{t("profile")}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/${locale}/settings`}>{t("settings")}</Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Déconnexion */}
        <DropdownMenuItem
          className="text-red-600"
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
        >
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

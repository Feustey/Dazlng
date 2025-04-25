"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { LogOut, User, Settings, BarChart3 } from "lucide-react";

export function AccountMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const locale = useLocale();

  if (!session) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-full hover:bg-accent/10 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          {session.user?.name?.[0] || <User className="w-5 h-5" />}
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg border border-border py-1 z-50">
          <div className="px-4 py-2 border-b border-border">
            <p className="font-medium">{session.user?.name}</p>
            <p className="text-sm text-muted-foreground">
              {session.user?.email}
            </p>
          </div>

          <div className="py-1">
            <Link
              href={`/${locale}/dashboard`}
              className="flex items-center px-4 py-2 text-sm hover:bg-accent/10"
              onClick={() => setIsOpen(false)}
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Dashboard
            </Link>
            <Link
              href={`/${locale}/profile`}
              className="flex items-center px-4 py-2 text-sm hover:bg-accent/10"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-3" />
              Profil
            </Link>
            <Link
              href={`/${locale}/settings`}
              className="flex items-center px-4 py-2 text-sm hover:bg-accent/10"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-3" />
              Paramètres
            </Link>
          </div>

          <div className="border-t border-border py-1">
            <button
              onClick={() => {
                signOut({ callbackUrl: `/${locale}` });
                setIsOpen(false);
              }}
              className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent/10 text-left"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

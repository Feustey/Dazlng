"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useSession } from "next-auth/react";
import { isPublicRoute } from "../config/protected-routes";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    if (status === "loading") return;

    if (!session && !isPublicRoute(pathname)) {
      router.push(`/${locale}/auth/signin`);
    }
  }, [session, status, pathname, router, locale]);

  if (status === "loading") {
    return null;
  }

  return <>{children}</>;
}

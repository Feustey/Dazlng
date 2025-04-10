"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale as string | undefined;
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      if (locale) {
        router.push(`/${locale}/login`);
      } else {
        router.push("/login");
      }
    }
  }, [user, isLoading, router, locale]);

  if (isLoading || !user) {
    return null;
  }

  return <>{children}</>;
}

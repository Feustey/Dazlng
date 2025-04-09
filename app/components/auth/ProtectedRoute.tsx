"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(`/${params.locale}/login`);
    }
  }, [isAuthenticated, router, params.locale]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

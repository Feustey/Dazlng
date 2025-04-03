"use client";

import { Skeleton } from "./skeleton";

interface LoadingProps {
  type?: "card" | "list" | "chart";
  count?: number;
}

export function Loading({ type = "card", count = 1 }: LoadingProps) {
  if (type === "card") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(count)].map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return null;
}

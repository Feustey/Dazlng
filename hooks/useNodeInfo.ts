"use client";

import { useSession } from "next-auth/react";

export interface NodeInfo {
  pubkey: string;
  nodePubkey?: string;
  lightningAddress?: string;
  isLoading: boolean;
}

export function useNodeInfo(): NodeInfo {
  const { data: session, status } = useSession();

  return {
    pubkey: session?.user?.pubkey || "",
    nodePubkey: session?.user?.nodePubkey || undefined,
    lightningAddress: session?.user?.lightningAddress || undefined,
    isLoading: status === "loading",
  };
}

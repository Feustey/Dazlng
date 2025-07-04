import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Session } from "@supabase/supabase-js";
import { getSupabaseAdminClient } from "@/lib/supabase";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export async function getNodePubkeyFromSession(session: Session): Promise<string | null> {
  if (!session?.user?.id) return null;

  const { data: profile, error } = await getSupabaseAdminClient()
    .from("profiles")
    .select("pubkey")
    .eq("id", session.user.id)
    .single();

  if (error || !profile?.pubkey) return null;
  return profile.pubkey;
}
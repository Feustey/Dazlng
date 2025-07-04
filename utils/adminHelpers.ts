import { NextRequest } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { ErrorCodes } from "@/types/database";
// import { supabase } from "@/lib/supabase";
// import type { User as SupabaseUser } from '@supabase/supabase-js';

// À adapter selon ta logique réelle de vérification admin
const ADMIN_PUBKEY = process.env.ADMIN_PUBKEY ?? "";

export async function validateAdminRequest(req: NextRequest): Promise<boolean> {
  // En développement, permettre l'accès depuis localhost
  if ((process.env.NODE_ENV ?? "") === "development" || req.headers.get("host")?.startsWith("localhost")) {
    return true;
  }

  // En production, vérifier la clé publique admin
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.substring(7);
  return token === ADMIN_PUBKEY;
}
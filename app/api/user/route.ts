import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

// Récupérer l'utilisateur connecté (via cookie ou header Authorization)
async function getUserFromRequest(req: NextRequest): Promise<SupabaseUser | null> {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await getSupabaseAdminClient().auth.getUser(token);
  return user;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Récupère les infos du profil
  const { data, error } = await getSupabaseAdminClient()
    .from("profiles")
    .select("id, email, nom, prenom, pubkey, compte_x, compte_nostr, t4g_tokens, node_id")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  // Par défaut, 1 token pour l'inscription si non défini
  return NextResponse.json({ ...data, t4g_tokens: data?.t4g_tokens ?? 1 });
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { nom, prenom, pubkey, compte_x, compte_nostr, node_id } = body;

  // Met à jour le profil
  const { error } = await getSupabaseAdminClient()
    .from("profiles")
    .update({ nom, prenom, pubkey, compte_x, compte_nostr, node_id })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ nom, prenom, pubkey, compte_x, compte_nostr, node_id });
}

export const dynamic = "force-dynamic";

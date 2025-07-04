import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase";

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { email, pubkey, choix, source } = await req.json();
    if (!email || !pubkey || !choix) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }
    const { error } = await getSupabaseAdminClient().from("prospects").insert([
      {
        email,
        pubkey,
        choix,
        source: source || "dazia-preview",
        prospect: true,
        date: new Date().toISOString()
      }
    ]);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
import { createSupabaseServerClient } from "@/lib/supabase-auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error("Erreur lors de la déconnexion:", error);
      return NextResponse.json({ error: "Erreur lors de la déconnexion" }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, message: "Déconnexion réussie" });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
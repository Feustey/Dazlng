import { createSupabaseServerClient } from "@/lib/supabase-auth";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { sendWelcomeEmail } from "@/lib/welcome-email";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const supabase = await createSupabaseServerClient();
    
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    
    // Récupérer les informations du profil
    const { data: profile } = await getSupabaseAdminClient()
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...profile
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
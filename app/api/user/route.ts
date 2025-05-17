import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Récupérer l'utilisateur connecté (via cookie ou header Authorization)
async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  // Récupère les infos du profil
  const { data, error } = await supabase
    .from("profiles")
    .select("name, email")
    .eq("id", user.id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json();
  const { name, email } = body;

  // Met à jour le profil
  const { error } = await supabase
    .from("profiles")
    .update({ name, email })
    .eq("id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ name, email });
}

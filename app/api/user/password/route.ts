import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { next } = await req.json();

  // On change directement le mot de passe
  const { error } = await supabase.auth.admin.updateUserById(user.id, { password: next });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}

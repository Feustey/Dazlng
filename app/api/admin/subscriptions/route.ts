import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { validateAdminAccess } from "@/utils/adminHelpers";

export async function GET(req: NextRequest): Promise<Response> {
  const isAdmin = await validateAdminAccess(req);
  if (!isAdmin) {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const sort = searchParams.get("sort") || "created_at:desc";
  const [sortField, sortOrder] = sort.split(":");
  const status = searchParams.get("status");
  let query = supabase.from("subscriptions").select("*", { count: "exact" });
  if (status) query = query.eq("status", status);
  query = query.order(sortField, { ascending: sortOrder === "asc" }).limit(limit);
  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
} 
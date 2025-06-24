import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { ApiResponse } from "@/types/database";

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await getSupabaseAdminClient().auth.getUser(token);
  return user;
}

// DELETE /api/users/me/favorites/[id] - Supprimer des favoris
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    const user = await getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Non autorisé"
        }
      }, { status: 401 });
    }

    // Vérifie que le favori appartient à l'utilisateur
    const { data: existingFavorite, error: _checkError } = await getSupabaseAdminClient()
      .from("user_favorites")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (!existingFavorite) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Favori non trouvé"
        }
      }, { status: 404 });
    }

    const { error } = await getSupabaseAdminClient()
      .from("user_favorites")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la suppression du favori"
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { message: "Favori supprimé avec succès" },
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    });

  } catch (error) {
    console.error("Erreur DELETE /api/users/me/favorites/[id]:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

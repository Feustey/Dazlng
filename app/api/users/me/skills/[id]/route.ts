import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { skillSchema, validateData } from "@/lib/validations";
import { ApiResponse } from "@/types/database";

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await getSupabaseAdminClient().auth.getUser(token);
  return user;
}

// PUT /api/users/me/skills/[id] - Modifier une compétence
export async function PUT(
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

    const body = await req.json();
    const validation = validateData(skillSchema, body);

    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Données invalides",
          details: (validation as any).error.details
        }
      }, { status: 400 });
    }

    // Vérifie que la compétence appartient à l'utilisateur
    const { data: existingSkill, error: checkError } = await getSupabaseAdminClient()
      .from("user_skills")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingSkill) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Compétence non trouvée"
        }
      }, { status: 404 });
    }

    const updateData = {
      ...validation.data,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await getSupabaseAdminClient()
      .from("user_skills")
      .update(updateData)
      .eq("id", params.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la mise à jour de la compétence"
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    });

  } catch (error) {
    console.error("Erreur PUT /api/users/me/skills/[id]:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

// DELETE /api/users/me/skills/[id] - Supprimer une compétence
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

    // Vérifie que la compétence appartient à l'utilisateur
    const { data: existingSkill, error: checkError } = await getSupabaseAdminClient()
      .from("user_skills")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingSkill) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Compétence non trouvée"
        }
      }, { status: 404 });
    }

    const { error } = await getSupabaseAdminClient()
      .from("user_skills")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la suppression de la compétence"
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { message: "Compétence supprimée avec succès" },
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    });

  } catch (error) {
    console.error("Erreur DELETE /api/users/me/skills/[id]:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
} 
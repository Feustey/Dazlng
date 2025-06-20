import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { experienceSchema, validateData } from "@/lib/validations";
import { ApiResponse } from "@/types/database";

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

// PUT /api/users/me/experiences/[id] - Modifier une expérience
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
    const validation = validateData(experienceSchema, body);

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

    // Vérifie que l'expérience appartient à l'utilisateur
    const { data: existingExperience, error: checkError } = await supabase
      .from("user_experiences")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingExperience) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Expérience non trouvée"
        }
      }, { status: 404 });
    }

    const updateData = {
      ...validation.data,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("user_experiences")
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
          message: "Erreur lors de la mise à jour de l'expérience"
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
    console.error("Erreur PUT /api/users/me/experiences/[id]:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

// DELETE /api/users/me/experiences/[id] - Supprimer une expérience
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

    // Vérifie que l'expérience appartient à l'utilisateur
    const { data: existingExperience, error: checkError } = await supabase
      .from("user_experiences")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single();

    if (checkError || !existingExperience) {
      return NextResponse.json({
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Expérience non trouvée"
        }
      }, { status: 404 });
    }

    const { error } = await supabase
      .from("user_experiences")
      .delete()
      .eq("id", params.id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la suppression de l'expérience"
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: { message: "Expérience supprimée avec succès" },
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    });

  } catch (error) {
    console.error("Erreur DELETE /api/users/me/experiences/[id]:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
} 
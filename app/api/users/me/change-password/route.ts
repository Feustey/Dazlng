import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { changePasswordSchema, validateData } from "@/lib/validations";
import { ApiResponse } from "@/types/database";

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await getSupabaseAdminClient().auth.getUser(token);
  return user;
}

// POST /api/users/me/change-password - Changement de mot de passe sécurisé
export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse>> {
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
    const validation = validateData(changePasswordSchema, body);

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

    // Vérifie le mot de passe actuel
    const { error: signInError } = await getSupabaseAdminClient().auth.signInWithPassword({
      email: user.email || '',
      password: validation.data.currentPassword
    });

    if (signInError) {
      return NextResponse.json({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Mot de passe actuel incorrect"
        }
      }, { status: 400 });
    }

    // Met à jour le mot de passe
    const { error: updateError } = await getSupabaseAdminClient().auth.updateUser({
      password: validation.data.newPassword
    });

    if (updateError) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la mise à jour du mot de passe"
        }
      }, { status: 500 });
    }

    // Enregistre le changement dans l'historique (optionnel)
    const { error: historyError } = await getSupabaseAdminClient()
      .from("password_history")
      .insert({
        user_id: user.id,
        changed_at: new Date().toISOString(),
        ip_address: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown"
      });

    if (historyError) {
      console.error("Erreur enregistrement historique mot de passe:", historyError);
    }

    return NextResponse.json({
      success: true,
      data: { message: "Mot de passe mis à jour avec succès" },
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    });

  } catch (error) {
    console.error("Erreur POST /api/users/me/change-password:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

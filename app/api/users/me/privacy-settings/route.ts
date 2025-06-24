import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { privacySettingsSchema, validateData } from "@/lib/validations";
import { ApiResponse } from "@/types/database";

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await getSupabaseAdminClient().auth.getUser(token);
  return user;
}

// GET /api/users/me/privacy-settings - Récupération des paramètres de confidentialité
export async function GET(req: NextRequest): Promise<NextResponse<ApiResponse>> {
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

    const { data, error } = await getSupabaseAdminClient()
      .from("profiles")
      .select("privacy_settings")
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la récupération des paramètres de confidentialité"
        }
      }, { status: 500 });
    }

    // Paramètres par défaut si aucun n'est défini
    const defaultPrivacySettings = {
      profileVisibility: "public" as const,
      showEmail: true,
      showPhone: false,
      showWallet: true,
      allowMessages: true,
      showOnlineStatus: true,
      showLastSeen: true,
      allowServiceRequests: true,
      allowNotifications: true
    };

    return NextResponse.json({
      success: true,
      data: data?.privacy_settings || defaultPrivacySettings,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    });

  } catch (error) {
    console.error("Erreur GET /api/users/me/privacy-settings:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

// PUT /api/users/me/privacy-settings - Mise à jour des paramètres de confidentialité
export async function PUT(req: NextRequest): Promise<NextResponse<ApiResponse>> {
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
    const validation = validateData(privacySettingsSchema, body);

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

    const { data, error } = await getSupabaseAdminClient()
      .from("profiles")
      .update({
        privacy_settings: validation.data,
        updated_at: new Date().toISOString()
      })
      .eq("id", user.id)
      .select("privacy_settings")
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la mise à jour des paramètres de confidentialité"
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data.privacy_settings,
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    });

  } catch (error) {
    console.error("Erreur PUT /api/users/me/privacy-settings:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

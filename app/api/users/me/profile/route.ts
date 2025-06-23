import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { profileUpdateSchema, validateData } from "@/lib/validations";
import { ApiResponse } from "@/types/database";

// Récupérer l'utilisateur connecté
async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await getSupabaseAdminClient().auth.getUser(token);
  return user;
}

// GET /api/users/me/profile - Récupération du profil complet
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

    // Récupère le profil complet avec les nouvelles propriétés
    const { data, error } = await getSupabaseAdminClient()
      .from("profiles")
      .select(`
        id, email, nom, prenom, pubkey, compte_x, compte_nostr, t4g_tokens, node_id,
        created_at, updated_at, settings, email_verified, verified_at,
        phone, preferences, social_links, privacy_settings, notification_settings,
        total_transactions, average_rating, total_reviews, completion_rate,
        response_time, active_days, referral_count, last_login_at
      `)
      .eq("id", user.id)
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la récupération du profil"
        }
      }, { status: 500 });
    }

    // Calcule le pourcentage de complétion du profil
    const profileCompletion = calculateProfileCompletion(data);

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        profileCompletion,
        t4g_tokens: data?.t4g_tokens ?? 1
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    });

  } catch (error) {
    console.error("Erreur GET /api/users/me/profile:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

// PATCH /api/users/me/profile - Mise à jour partielle du profil
export async function PATCH(req: NextRequest): Promise<NextResponse<ApiResponse>> {
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
    const validation = validateData(profileUpdateSchema, body);

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

    const updateData: any = {};
    
    // Mise à jour des champs de base
    if (validation.data.firstname) updateData.prenom = validation.data.firstname;
    if (validation.data.lastname) updateData.nom = validation.data.lastname;
    if (validation.data.phone) updateData.phone = validation.data.phone;
    
    // Mise à jour des préférences
    if (validation.data.preferences) {
      updateData.preferences = validation.data.preferences;
    }
    
    // Mise à jour des liens sociaux
    if (validation.data.socialLinks) {
      updateData.social_links = validation.data.socialLinks;
    }

    updateData.updated_at = new Date().toISOString();

    const { data, error } = await getSupabaseAdminClient()
      .from("profiles")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la mise à jour du profil"
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
    console.error("Erreur PATCH /api/users/me/profile:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

// Fonction utilitaire pour calculer le pourcentage de complétion du profil
function calculateProfileCompletion(profile: any): number {
  const fields = [
    'nom', 'prenom', 'email', 'phone', 'pubkey',
    'preferences', 'social_links', 'privacy_settings'
  ];
  
  const completedFields = fields.filter(field => {
    const value = profile[field];
    if (typeof value === 'string') return value && value.trim().length > 0;
    if (typeof value === 'object') return value && Object.keys(value).length > 0;
    return !!value;
  });

  return Math.round((completedFields.length / fields.length) * 100);
} 
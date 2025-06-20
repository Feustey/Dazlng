import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { favoriteSchema, validateData } from "@/lib/validations";
import { ApiResponse } from "@/types/database";

async function getUserFromRequest(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user;
}

// GET /api/users/me/favorites - Liste des favoris
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

    const { data, error } = await supabase
      .from("user_favorites")
      .select("*")
      .eq("user_id", user.id)
      .order("added_at", { ascending: false });

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de la récupération des favoris"
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      meta: {
        timestamp: new Date().toISOString(),
        version: "1.0"
      }
    });

  } catch (error) {
    console.error("Erreur GET /api/users/me/favorites:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
}

// POST /api/users/me/favorites - Ajouter aux favoris
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
    const validation = validateData(favoriteSchema, body);

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

    // Vérifie si le favori existe déjà
    const { data: existingFavorite, error: _checkError } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("type", validation.data.type)
      .eq("item_id", validation.data.itemId)
      .single();

    if (existingFavorite) {
      return NextResponse.json({
        success: false,
        error: {
          code: "BAD_REQUEST",
          message: "Cet élément est déjà dans vos favoris"
        }
      }, { status: 400 });
    }

    const favoriteData = {
      ...validation.data,
      user_id: user.id,
      added_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from("user_favorites")
      .insert(favoriteData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        success: false,
        error: {
          code: "DATABASE_ERROR",
          message: "Erreur lors de l'ajout aux favoris"
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
    console.error("Erreur POST /api/users/me/favorites:", error);
    return NextResponse.json({
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Erreur interne du serveur"
      }
    }, { status: 500 });
  }
} 
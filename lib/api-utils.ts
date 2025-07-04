import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "./supabase-auth";
import { getSupabaseAdminClient } from "./supabase";
import { ErrorCodes } from "@/types/database";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Types pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    version: string;
  };
}

/**
 * Gestionnaire d'erreur standardisé pour les routes API
 */
export function handleApiError(error: any): ApiResponse<null> {
  console.error("❌ Erreur API:", error);
  
  const isSupabaseError = error?.code && typeof error.code === "string";
  const message = error?.message || "Erreur interne du serveur";
  
  return {
    success: false,
    error: {
      code: isSupabaseError ? error.code : ErrorCodes.INTERNAL_ERROR,
      message,
      details: (process.env.NODE_ENV || "") === "development" ? error : undefined
    }
  };
}

/**
 * Récupère l'utilisateur authentifié à partir de la requête
 * Utilise createSupabaseServerClient pour les opérations authentifiées standard
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<SupabaseUser | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    
    if (token) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error) throw error;
      return user;
    }
    
    // Fallback sur la session cookie
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("❌ Erreur authentification:", error);
    return null;
  }
}

/**
 * Récupère l'utilisateur authentifié avec droits admin
 * Utilise getSupabaseAdminClient pour les opérations nécessitant des droits admin
 */
export async function getAuthenticatedAdminUser(req: NextRequest): Promise<SupabaseUser | null> {
  try {
    const supabase = getSupabaseAdminClient();
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    
    if (!token) return null;
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;
    
    // Vérifier si l'utilisateur est admin
    const { data: adminRole } = await supabase
      .from("admin_roles")
      .select("role")
      .eq("user_id", user?.id || "")
      .single();
      
    return adminRole ? user : null;
  } catch (error) {
    console.error("❌ Erreur authentification admin:", error);
    return null;
  }
}

/**
 * Middleware pour les routes authentifiées
 */
export async function withAuth(
  req: NextRequest,
  handler: (user: SupabaseUser) => Promise<Response>
): Promise<Response> {
  const user = await getAuthenticatedUser(req);
  
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.UNAUTHORIZED,
          message: "Non authentifié"
        }
      },
      { status: 401 }
    );
  }
  
  try {
    return await handler(user);
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}

/**
 * Middleware pour les routes admin
 */
export async function withAdminAuth(
  req: NextRequest,
  handler: (user: SupabaseUser) => Promise<Response>
): Promise<Response> {
  const user = await getAuthenticatedAdminUser(req);
  
  if (!user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ErrorCodes.FORBIDDEN,
          message: "Accès non autorisé"
        }
      },
      { status: 403 }
    );
  }
  
  try {
    return await handler(user);
  } catch (error) {
    return NextResponse.json(handleApiError(error), { status: 500 });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { skillSchema } from "@/lib/validations";
import { withAuth, handleApiError } from '@/lib/api-utils';
import { ErrorCodes } from "@/types/database";

// GET /api/users/me/skills - Liste des compétences
export async function GET(req: NextRequest): Promise<Response> {
  return withAuth(req, async (user) => {
    try {
      const { data, error } = await getSupabaseAdminClient()
        .from("user_skills")
        .select("*")
        .eq("user_id", user.id)
        .order("level", { ascending: false });

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: data || [],
        meta: {
          timestamp: new Date().toISOString(),
          version: "1.0"
        }
      });
    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
}

// POST /api/users/me/skills - Ajouter une compétence
export async function POST(req: NextRequest): Promise<Response> {
  return withAuth(req, async (user) => {
    try {
      const body = await req.json();
      const result = skillSchema.safeParse(body);

      if (!result.success) {
        return NextResponse.json({
          success: false,
          error: {
            code: ErrorCodes.VALIDATION_ERROR,
            message: "Données invalides",
            details: result.error.issues
          }
        }, { status: 400 });
      }

      const skillData = {
        ...result.data,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await getSupabaseAdminClient()
        .from("user_skills")
        .insert(skillData)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
          version: "1.0"
        }
      });
    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
} 
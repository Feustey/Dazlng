import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { experienceSchema } from "@/lib/validations";
import { withAuth, handleApiError } from '@/lib/api-utils';
import { ErrorCodes } from "@/types/database";

// GET /api/users/me/experiences - Liste des expériences
export async function GET(req: NextRequest): Promise<Response> {
  return withAuth(req, async (user: any) => {
    try {
      const { data, error } = await getSupabaseAdminClient()
        .from("user_experiences")
        .select("*")
        .eq("user_id", user.id)
        .order("from", { ascending: false });

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

// POST /api/users/me/experiences - Créer une expérience
export async function POST(req: NextRequest): Promise<Response> {
  return withAuth(req, async (user: any) => {
    try {
      const body = await req.json();
      const result = experienceSchema.safeParse(body);

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

      const experienceData = {
        ...result.data,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await getSupabaseAdminClient()
        .from("user_experiences")
        .insert(experienceData)
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

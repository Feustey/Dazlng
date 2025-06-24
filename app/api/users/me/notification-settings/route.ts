import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from '@/lib/supabase';
import { notificationSettingsSchema } from "@/lib/validations";
import { withAuth, handleApiError } from '@/lib/api-utils';
import { ErrorCodes } from "@/types/database";

// GET /api/users/me/notification-settings - Récupérer les paramètres de notification
export async function GET(req: NextRequest): Promise<Response> {
  return withAuth(req, async (user: any) => {
    try {
      const { data, error } = await getSupabaseAdminClient()
        .from("user_notification_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: data || {
          user_id: user.id,
          email_notifications: true,
          push_notifications: true,
          newsletter: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
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

// POST /api/users/me/notification-settings - Mettre à jour les paramètres
export async function POST(req: NextRequest): Promise<Response> {
  return withAuth(req, async (user: any) => {
    try {
      const body = await req.json();
      const result = notificationSettingsSchema.safeParse(body);

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

      const settingsData = {
        ...result.data,
        user_id: user.id,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await getSupabaseAdminClient()
        .from("user_notification_settings")
        .upsert(settingsData)
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

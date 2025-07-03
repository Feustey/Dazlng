import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase';

export async function GET(): Promise<Response> {
  try {
    // Test 1: Vérifier la connexion basique avec une table existante
    const { data: connectionTest, error: connectionError } = await getSupabaseAdminClient()
      .from('profiles')
      .select('id')
      .limit(1);

    // Test 2: Vérifier l'authentification actuelle
    const { data: { session }, error: sessionError } = await getSupabaseAdminClient().auth.getSession();

    // Test 3: Vérifier l'accès aux profils avec gestion des erreurs
    let profilesTest = null;
    let profilesError: unknown = null;
    try {
      const { data, error } = await getSupabaseAdminClient()
        .from('profiles')
        .select('id, email')
        .limit(1);
      profilesTest = data;
      profilesError = error;
    } catch (e) {
      profilesError = e;
    }

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      tests: {
        connection: {
          success: !connectionError,
          error: connectionError?.message,
          result: connectionTest
        },
        session: {
          success: !sessionError,
          error: sessionError?.message,
          has_session: !!session,
          user_id: session?.user?.id
        },
        profiles_access: {
          success: !profilesError,
          error: profilesError instanceof Error ? profilesError.message : String(profilesError),
          result: profilesTest
        }
      },
      environment: {
        url_configured: !!(process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""),
        key_configured: !!(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""),
        url_preview: (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "")?.substring(0, 30) + '...',
        node_env: (process.env.NODE_ENV ?? "")
      }
    });

  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(): Promise<Response> {
  try {
    // Test 1: Vérifier la connexion basique
    const { data: connectionTest, error: connectionError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .limit(1);

    // Test 2: Vérifier l'accès aux tables auth
    let authTablesTest = null;
    let authError = null;
    try {
      const { data, error } = await supabase.rpc('get_auth_tables');
      authTablesTest = data;
      authError = error;
    } catch (e) {
      authError = e;
    }

    // Test 3: Vérifier les tables personnalisées
    const { data: customTables, error: customTablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    // Test 4: Vérifier l'authentification actuelle
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    // Test 5: Essayer de lister les utilisateurs (test des permissions)
    let usersTest = null;
    let usersError = null;
    try {
      const { data, error } = await supabase
        .from('auth.users')
        .select('id')
        .limit(1);
      usersTest = data;
      usersError = error;
    } catch (e) {
      usersError = e;
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
        auth_tables: {
          success: !authError,
          error: authError instanceof Error ? authError.message : String(authError),
          result: authTablesTest
        },
        custom_tables: {
          success: !customTablesError,
          error: customTablesError?.message,
          tables: customTables?.map(t => t.table_name)
        },
        session: {
          success: !sessionError,
          error: sessionError?.message,
          has_session: !!session,
          user_id: session?.user?.id
        },
        users_access: {
          success: !usersError,
          error: usersError instanceof Error ? usersError.message : String(usersError),
          result: usersTest
        }
      },
      environment: {
        url_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        key_configured: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        url_preview: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...',
        node_env: process.env.NODE_ENV
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
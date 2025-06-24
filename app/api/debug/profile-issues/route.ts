import { createSupabaseServerClient } from '@/lib/supabase-auth'
import { getSupabaseAdminClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // En développement, permettre l'accès sans auth pour diagnostic
    if (process.env.NODE_ENV ?? "" === 'development') {
      // Pas d'auth requise en dev
    } else {
      // En production, vérifier l'authentification admin
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
      }
    }

    // Diagnostiquer les problèmes de profil
    const { data: issues, error: diagError } = await getSupabaseAdminClient().rpc('diagnose_profile_issues')

    if (diagError) {
      console.error('[DIAGNOSTIC] Erreur diagnostic:', diagError)
      return NextResponse.json({ error: 'Erreur lors du diagnostic' }, { status: 500 })
    }

    // Obtenir des statistiques supplémentaires
    const { data: profileStats, error: _statsError } = await getSupabaseAdminClient()
      .from('profiles')
      .select('id, email, created_at, profile_score')
      .order('created_at', { ascending: false })
      .limit(10)

    const { count: profileCount } = await getSupabaseAdminClient()
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      success: true,
      data: {
        issues: issues || [],
        totalProfiles: profileCount || 0,
        recentProfiles: profileStats || [],
        diagnosticTime: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error("Erreur lors du diagnostic des profils:", error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

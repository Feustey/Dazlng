import { createSupabaseServerClient } from '@/lib/supabase-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    const supabase = createSupabaseServerClient()
    let user = null;
    
    // ✅ CORRECTIF : Vérifier aussi le token Authorization
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user: tokenUser }, error } = await supabase.auth.getUser(token);
      
      if (error || !tokenUser) {
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
      }
      user = tokenUser;
    } else {
      // Fallback sur la session cookie
      const { data: { user: sessionUser }, error } = await supabase.auth.getUser()
      
      if (error || !sessionUser) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
      }
      user = sessionUser;
    }

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 401 })
    }

    // Récupérer le profil depuis la table profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    let userProfile = profile;

    // Si le profil n'existe pas, le créer automatiquement
    if (profileError && profileError.code === 'PGRST116') {
      console.log('[API] Création automatique du profil pour utilisateur:', user.id)
      
      const { data: newProfile, error: createError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          t4g_tokens: 1, // Valeur par défaut
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('*')
        .single()

      if (createError) {
        console.error('[API] Erreur création profil automatique:', createError)
        return NextResponse.json({ error: 'Erreur lors de la création du profil' }, { status: 500 })
      }

      userProfile = newProfile;
    } else if (profileError) {
      console.error('[API] Erreur récupération profil:', profileError)
      return NextResponse.json({ error: 'Erreur lors de la récupération du profil' }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...userProfile
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des informations utilisateur:", error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

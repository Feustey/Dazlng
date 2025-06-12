import { createSupabaseServerClient } from '@/lib/supabase-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { sendWelcomeEmail } from '@/lib/welcome-email'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    // Mode développement - bypass Supabase si non configuré
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
    
    if (isDevelopment && (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)) {
      console.log('[API] Mode développement - Supabase non configuré, utilisateur de test retourné');
      return NextResponse.json({
        success: true,
        user: {
          id: 'dev-user-id',
          email: 'dev@dazno.de',
          nom: 'Développeur',
          prenom: 'Test',
          t4g_tokens: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          settings: {},
          email_verified: true
        }
      });
    }
    
    const supabase = await createSupabaseServerClient()
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
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Configuration serveur incorrecte' }, { status: 500 })
    }
    
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    let userProfile = profile;

    // Si le profil n'existe pas, utiliser la fonction SQL pour le créer
    if (profileError && profileError.code === 'PGRST116') {
      console.log('[API] Création automatique du profil pour utilisateur:', user.id)
      
      try {
        const { data: profileData, error: createError } = await supabaseAdmin!.rpc(
          'ensure_profile_exists', 
          { 
            user_id: user.id, 
            user_email: user.email 
          }
        )

        if (createError) {
          console.error('[API] Erreur création profil via fonction:', createError)
          return NextResponse.json({ error: 'Erreur lors de la création du profil' }, { status: 500 })
        }

        userProfile = profileData;
        
        // 🎉 Envoyer l'email de bienvenue pour les nouveaux utilisateurs
        console.log('[API] Envoi email de bienvenue pour nouveau profil:', user.email)
        try {
          await sendWelcomeEmail({
            email: user.email || '',
            nom: userProfile?.nom,
            prenom: userProfile?.prenom
          });
        } catch (emailError) {
          console.error('[API] Erreur envoi email de bienvenue:', emailError);
          // Ne pas faire échouer la création du profil si l'email échoue
        }
        
      } catch (funcError) {
        console.error('[API] Erreur appel fonction ensure_profile_exists:', funcError)
        return NextResponse.json({ error: 'Erreur lors de la création du profil' }, { status: 500 })
      }
    } else if (profileError) {
      console.error('[API] Erreur récupération profil:', profileError)
      return NextResponse.json({ error: 'Erreur lors de la récupération du profil' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        ...userProfile
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des informations utilisateur:", error);
    
    // Mode développement - fallback en cas d'erreur
    const isDevelopment = !process.env.NODE_ENV || process.env.NODE_ENV !== 'production';
    if (isDevelopment) {
      console.log('[API] Erreur en mode développement, utilisateur de fallback retourné');
      return NextResponse.json({
        success: true,
        user: {
          id: 'dev-fallback-id',
          email: 'dev-fallback@dazno.de',
          nom: 'Développeur',
          prenom: 'Fallback',
          t4g_tokens: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          settings: {},
          email_verified: true
        }
      });
    }
    
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

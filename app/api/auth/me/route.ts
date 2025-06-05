import { createSupabaseServerClient } from '@/lib/supabase-auth'
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
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        ...profile
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des informations utilisateur:", error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

import { createSupabaseServerClient } from '@/lib/supabase-auth'
import { NextResponse } from 'next/server'

export const dynamic = "force-dynamic";

export async function GET(): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    const supabase = createSupabaseServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
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
    // console.error(
    //   "Erreur lors de la récupération des informations utilisateur:",
    //   error
    // );
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

import { createSupabaseServerClient } from '@/lib/supabase-auth'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = "force-dynamic";

export async function POST(_request: NextRequest): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    const supabase = await createSupabaseServerClient()
    
    // Déconnecter l'utilisateur
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Erreur lors de la déconnexion:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erreur lors de la déconnexion' 
        }, 
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Déconnexion réussie' 
      },
      { 
        status: 200,
        headers: {
          // Supprimer les cookies de session
          'Set-Cookie': 'sb-access-token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax'
        }
      }
    )
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur serveur' 
      }, 
      { status: 500 }
    )
  }
}

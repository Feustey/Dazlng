import { createSupabaseServerClient } from '@/lib/supabase-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

// Schéma de validation pour la mise à jour du profil
const UpdateProfileSchema = z.object({
  nom: z.string().optional(),
  prenom: z.string().optional(),
  pubkey: z.union([
    z.string().regex(/^[0-9a-fA-F]{66}$/, 'Pubkey invalide'),
    z.null()
  ]).optional(),
  compte_x: z.string().optional(),
  compte_nostr: z.string().optional(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide').optional(),
  phone_verified: z.boolean().optional(),
})

export async function GET(request: NextRequest): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    const supabase = createSupabaseServerClient()
    
    // Récupération de l'utilisateur
    const authHeader = request.headers.get('authorization');
    let user = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user: tokenUser }, error } = await supabase.auth.getUser(token);
      
      if (error || !tokenUser) {
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
      }
      user = tokenUser;
    } else {
      const { data: { user: sessionUser }, error } = await supabase.auth.getUser()
      
      if (error || !sessionUser) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
      }
      user = sessionUser;
    }

    // Récupérer le profil depuis la table profiles
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Si le profil n'existe pas, le créer automatiquement
    if (profileError && profileError.code === 'PGRST116') {
      console.log('[API] Création automatique du profil pour utilisateur:', user.id)
      
      try {
        const { data: profileData, error: createError } = await supabaseAdmin.rpc(
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

        return NextResponse.json({
          profile: {
            id: user.id,
            email: user.email,
            ...profileData
          }
        })
        
      } catch (funcError) {
        console.error('[API] Erreur appel fonction ensure_profile_exists:', funcError)
        return NextResponse.json({ error: 'Erreur lors de la création du profil' }, { status: 500 })
      }
    } else if (profileError) {
      console.error('[API] Erreur récupération profil:', profileError)
      return NextResponse.json({ error: 'Erreur lors de la récupération du profil' }, { status: 500 })
    }

    return NextResponse.json({
      profile: {
        id: user.id,
        email: user.email,
        ...profile
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    const supabase = createSupabaseServerClient()
    
    // Récupération de l'utilisateur
    const authHeader = request.headers.get('authorization');
    let user = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user: tokenUser }, error } = await supabase.auth.getUser(token);
      
      if (error || !tokenUser) {
        return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
      }
      user = tokenUser;
    } else {
      const { data: { user: sessionUser }, error } = await supabase.auth.getUser()
      
      if (error || !sessionUser) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
      }
      user = sessionUser;
    }

    // Parse et validation des données
    const body = await request.json()
    const validatedData = UpdateProfileSchema.parse(body)

    // Mise à jour du profil (ou création s'il n'existe pas)
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        ...validatedData,
        updated_at: new Date().toISOString()
      }, { 
        onConflict: 'id',
        ignoreDuplicates: false 
      })
      .select('*')
      .single()

    if (updateError) {
      console.error('[API] Erreur mise à jour profil:', updateError)
      return NextResponse.json({ error: 'Erreur lors de la mise à jour du profil' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user.id,
        email: user.email,
        ...updatedProfile
      }
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Données invalides', 
        details: error.errors 
      }, { status: 400 })
    }
    
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
} 
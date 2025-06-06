import { createSupabaseServerClient } from '@/lib/supabase-auth'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

// Schéma de validation pour la mise à jour du profil
const UpdateProfileSchema = z.object({
  nom: z.string().trim().optional(),
  prenom: z.string().trim().optional(),
  pubkey: z.union([
    z.string().trim().regex(/^[0-9a-fA-F]{66}$/, 'Clé publique Lightning invalide (66 caractères hexadécimaux requis)'),
    z.string().length(0), // Permet une chaîne vide
    z.null()
  ]).optional(),
  compte_x: z.string().trim().optional(),
  compte_nostr: z.string().trim().optional(),
  phone: z.union([
    z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide'),
    z.string().length(0), // Permet une chaîne vide
    z.null()
  ]).optional(),
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
    console.log('[API] Données reçues pour mise à jour profil:', JSON.stringify(body, null, 2))
    
    const validatedData = UpdateProfileSchema.parse(body)
    console.log('[API] Données validées:', JSON.stringify(validatedData, null, 2))

    // Fonction utilitaire pour nettoyer les chaînes vides
    const cleanStringValue = (value: string | null | undefined): string | null => {
      if (!value || value.trim() === '') return null;
      return value.trim();
    }

    // Préparation des données pour l'upsert
    const profileData = {
      id: user.id,
      email: user.email,
      nom: cleanStringValue(validatedData.nom),
      prenom: cleanStringValue(validatedData.prenom),
      pubkey: cleanStringValue(validatedData.pubkey),
      compte_x: cleanStringValue(validatedData.compte_x),
      compte_nostr: cleanStringValue(validatedData.compte_nostr),
      phone: cleanStringValue(validatedData.phone),
      phone_verified: validatedData.phone_verified || false,
      email_verified: true, // Par défaut après connexion
      updated_at: new Date().toISOString()
    }
    
    console.log('[API] Données à sauvegarder:', JSON.stringify(profileData, null, 2))

    // Mise à jour du profil (ou création s'il n'existe pas)
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .upsert(profileData, { 
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
      console.error('[API] Erreur de validation:', error.errors)
      const errorMessage = error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ')
      return NextResponse.json({ 
        error: { 
          message: `Données invalides: ${errorMessage}`,
          details: error.errors
        }
      }, { status: 400 })
    }
    
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json({ 
      error: { 
        message: error.message || 'Erreur serveur lors de la mise à jour du profil'
      }
    }, { status: 500 })
  }
} 
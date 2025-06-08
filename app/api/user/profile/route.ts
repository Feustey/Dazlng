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
  compte_telegram: z.union([
    z.string().trim().regex(/^@[a-zA-Z0-9_]{5,32}$/, 'Format Telegram invalide (doit commencer par @ et contenir 5-32 caractères)'),
    z.string().length(0), // Permet une chaîne vide
    z.null()
  ]).optional(),
  phone: z.union([
    z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide'),
    z.string().length(0), // Permet une chaîne vide
    z.null()
  ]).optional(),
  phone_verified: z.boolean().optional(),
  address: z.string().trim().optional(),
  ville: z.string().trim().optional(),
  code_postal: z.union([
    z.string().trim().regex(/^[0-9]{5}$/, 'Code postal invalide (5 chiffres requis)'),
    z.string().length(0), // Permet une chaîne vide
    z.null()
  ]).optional(),
  pays: z.string().trim().optional(),
})

export async function GET(request: NextRequest): Promise<ReturnType<typeof NextResponse.json>> {
  try {
    // Vérifier que le client admin est disponible
    if (!supabaseAdmin) {
      console.error('[API GET] Client Supabase admin non configuré')
      return NextResponse.json({ 
        error: 'Configuration serveur manquante (SUPABASE_SERVICE_ROLE_KEY)' 
      }, { status: 500 })
    }

    const supabase = await createSupabaseServerClient()
    
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
    const { data: profile, error: profileError } = await supabaseAdmin!
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Si le profil n'existe pas, le créer automatiquement
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
    const supabase = await createSupabaseServerClient()
    
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
    
    // Validation avec gestion d'erreur gracieuse pour les nouveaux champs
    let validatedData: any
    try {
      validatedData = UpdateProfileSchema.parse(body)
      console.log('[API] Données validées (schema complet):', JSON.stringify(validatedData, null, 2))
    } catch (zodError: any) {
      console.warn('[API] Erreur validation schema complet, tentative avec schema de base...')
      
      // Schema de base pour compatibilité ascendante
      const BaseProfileSchema = z.object({
        nom: z.string().trim().optional(),
        prenom: z.string().trim().optional(),
        pubkey: z.union([
          z.string().trim().regex(/^[0-9a-fA-F]{66}$/, 'Clé publique Lightning invalide'),
          z.string().length(0),
          z.null()
        ]).optional(),
        compte_x: z.string().trim().optional(),
        compte_nostr: z.string().trim().optional(),
        phone: z.union([
          z.string().trim().regex(/^\+?[1-9]\d{1,14}$/, 'Format de téléphone invalide'),
          z.string().length(0),
          z.null()
        ]).optional(),
        phone_verified: z.boolean().optional(),
      })
      
      try {
        // Filtrer les champs connus pour le schema de base
        const baseBody = Object.fromEntries(
          Object.entries(body).filter(([key]) => 
            ['nom', 'prenom', 'pubkey', 'compte_x', 'compte_nostr', 'phone', 'phone_verified'].includes(key)
          )
        )
        
        validatedData = {
          ...BaseProfileSchema.parse(baseBody),
          // Ajouter les nouveaux champs sans validation stricte
          ...Object.fromEntries(
            Object.entries(body).filter(([key]) => 
              ['compte_telegram', 'address', 'ville', 'code_postal', 'pays'].includes(key)
            )
          )
        }
        
        console.log('[API] Données validées (schema de base + nouveaux champs):', JSON.stringify(validatedData, null, 2))
      } catch (baseError) {
        throw zodError // Relancer l'erreur originale si même le schema de base échoue
      }
    }

    // Fonction utilitaire pour nettoyer les chaînes vides
    const cleanStringValue = (value: string | null | undefined): string | null => {
      if (!value || value.trim() === '') return null;
      return value.trim();
    }

    // Vérifier que le client admin est disponible
    if (!supabaseAdmin) {
      console.error('[API] Client Supabase admin non configuré')
      return NextResponse.json({ 
        error: 'Configuration serveur manquante (SUPABASE_SERVICE_ROLE_KEY)' 
      }, { status: 500 })
    }

    // Vérifier quels champs sont disponibles en base
    let availableColumns: string[] = []
    try {
      const { data: columns } = await supabaseAdmin!
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'profiles')
        .eq('table_schema', 'public')
      
      availableColumns = columns?.map(col => col.column_name) || []
      console.log('[API] Colonnes disponibles:', availableColumns)
    } catch (columnError) {
      console.warn('[API] Impossible de vérifier les colonnes, utilisation des champs de base')
      availableColumns = ['id', 'email', 'nom', 'prenom', 'pubkey', 'compte_x', 'compte_nostr', 'phone', 'phone_verified', 'email_verified', 'updated_at']
    }

    // Construire les données de profil en fonction des colonnes disponibles
    const baseProfileData: any = {
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

    // Ajouter les nouveaux champs seulement s'ils existent en base
    const newFields = {
      compte_telegram: cleanStringValue(validatedData.compte_telegram),
      address: cleanStringValue(validatedData.address),
      ville: cleanStringValue(validatedData.ville),
      code_postal: cleanStringValue(validatedData.code_postal),
      pays: cleanStringValue(validatedData.pays) || 'France'
    }

    Object.entries(newFields).forEach(([key, value]) => {
      if (availableColumns.includes(key)) {
        baseProfileData[key] = value
      } else {
        console.warn(`[API] Champ ${key} ignoré car non disponible en base`)
      }
    })

    const profileData = baseProfileData
    
    console.log('[API] Données à sauvegarder:', JSON.stringify(profileData, null, 2))

    // Mise à jour du profil (ou création s'il n'existe pas)
    const { data: updatedProfile, error: updateError } = await supabaseAdmin!
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
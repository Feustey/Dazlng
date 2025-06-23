import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { withAuth, handleApiError } from '@/lib/api-utils'
import { getSupabaseAdminClient } from '@/lib/supabase'

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

export async function GET(request: NextRequest): Promise<Response> {
  return withAuth(request, async (user) => {
    try {
      // Récupérer le profil depuis la table profiles
      const { data: profile, error: profileError } = await getSupabaseAdminClient()
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      // Si le profil n'existe pas, le créer automatiquement
      if (profileError && profileError.code === 'PGRST116') {
        console.log('[API] Création automatique du profil pour utilisateur:', user.id)
        
        try {
          const { data: profileData, error: createError } = await getSupabaseAdminClient().rpc(
            'ensure_profile_exists', 
            { 
              user_id: user.id, 
              user_email: user.email 
            }
          )

          if (createError) throw createError;

          return NextResponse.json({
            success: true,
            data: {
              id: user.id,
              email: user.email,
              ...profileData
            }
          })
          
        } catch (error) {
          return NextResponse.json(handleApiError(error), { status: 500 });
        }
      } else if (profileError) {
        throw profileError;
      }

      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          ...profile
        }
      })
    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
}

export async function PUT(request: NextRequest): Promise<Response> {
  return withAuth(request, async (user) => {
    try {
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

      // Nettoyer les valeurs de chaînes
      const cleanStringValue = (value: string | null | undefined): string | null => {
        if (value === undefined || value === null) return null;
        const trimmed = value.trim();
        return trimmed === '' ? null : trimmed;
      };

      // Nettoyer toutes les valeurs de chaînes
      Object.keys(validatedData).forEach(key => {
        if (typeof validatedData[key] === 'string') {
          validatedData[key] = cleanStringValue(validatedData[key]);
        }
      });

      // Mise à jour du profil
      const { error: updateError } = await getSupabaseAdminClient()
        .from('profiles')
        .update(validatedData)
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Récupérer le profil mis à jour
      const { data: updatedProfile, error: getError } = await getSupabaseAdminClient()
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (getError) throw getError;

      return NextResponse.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          ...updatedProfile
        }
      });
    } catch (error) {
      return NextResponse.json(handleApiError(error), { status: 500 });
    }
  });
} 
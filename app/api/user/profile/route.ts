import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth-utils'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { ErrorCodes } from '@/types/database'

export const dynamic = "force-dynamic";
export const runtime = 'nodejs';

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const { user, error, isAdmin } = await requireAuth(request)
    
    if (error || !user) {
      return NextResponse.json({
        success: false,
        error: {
          code: ErrorCodes.UNAUTHORIZED,
          message: error || 'Non authentifié'
        }
      }, { status: 401 })
    }

    // Récupérer le profil complet
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('[API] Erreur récupération profil:', profileError)
      return NextResponse.json({
        success: false,
        error: {
          code: ErrorCodes.DATABASE_ERROR,
          message: 'Erreur lors de la récupération du profil'
        }
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...profile,
        isAdmin
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })

  } catch (error) {
    console.error('[API] Erreur inattendue:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'Erreur interne du serveur'
      }
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest): Promise<NextResponse> {
  try {
    const { user, error } = await requireAuth(request)
    
    if (error || !user) {
      return NextResponse.json({
        success: false,
        error: {
          code: ErrorCodes.UNAUTHORIZED,
          message: error || 'Non authentifié'
        }
      }, { status: 401 })
    }

    const updateData = await request.json()
    
    // Validation des données (exemple basique)
    const allowedFields = ['nom', 'prenom', 'pubkey', 'compte_x', 'compte_nostr']
    const filteredData = Object.keys(updateData)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = updateData[key]
        return obj
      }, {} as any)

    if (Object.keys(filteredData).length === 0) {
      return NextResponse.json({
        success: false,
        error: {
          code: ErrorCodes.VALIDATION_ERROR,
          message: 'Aucune donnée valide à mettre à jour'
        }
      }, { status: 400 })
    }

    // Mettre à jour le profil
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({
        ...filteredData,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('[API] Erreur mise à jour profil:', updateError)
      return NextResponse.json({
        success: false,
        error: {
          code: ErrorCodes.DATABASE_ERROR,
          message: 'Erreur lors de la mise à jour du profil'
        }
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0'
      }
    })

  } catch (error) {
    console.error('[API] Erreur inattendue:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: ErrorCodes.INTERNAL_ERROR,
        message: 'Erreur interne du serveur'
      }
    }, { status: 500 })
  }
} 
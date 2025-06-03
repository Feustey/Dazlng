import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from 'lib/supabase'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret' // Mets ta vraie clé en prod !

const VerifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4).max(8)
})

export async function POST(req: NextRequest): Promise<NextResponse> {
  const timestamp = new Date().toISOString()
  try {
    const body = await req.json()
    const parsed = VerifyCodeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Entrée invalide',
          details: parsed.error.flatten()
        },
        meta: { timestamp, version: '1.0.0' }
      }, { status: 400 })
    }

    const { email, code } = parsed.data
    const supabase = createServerClient()

    // Recherche du code OTP valide
    const { data: otp, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .single()

    const now = Date.now()
    if (
      error ||
      !otp ||
      !otp.expires_at ||
      Number(otp.expires_at) < now
    ) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Code OTP invalide ou expiré'
        },
        meta: { timestamp, version: '1.0.0' }
      }, { status: 401 })
    }

    // Marquer le code comme utilisé
    await supabase
      .from('otp_codes')
      .update({ used: true })
      .eq('id', otp.id)

    // Récupérer ou créer le profil utilisateur
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .single()

    if (!profile) {
      // Création du profil minimal
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          email,
          nom: '',
          prenom: '',
          t4g_tokens: 1,
          settings: {},
          email_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          verified_at: new Date().toISOString()
        })
        .select('*')
        .single()
      profile = newProfile
    }

    // Générer le JWT
    const token = jwt.sign(
      {
        id: profile.id,
        email: profile.email,
        nom: profile.nom,
        prenom: profile.prenom
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Retourner le token et le profil
    return NextResponse.json({
      success: true,
      data: {
        token,
        profile
      },
      meta: { timestamp, version: '1.0.0' }
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur serveur',
        details: err instanceof Error ? err.message : err
      },
      meta: { timestamp, version: '1.0.0' }
    }, { status: 500 })
  }
}

export function GET(): NextResponse {
  return NextResponse.json(
    { success: false, error: { code: 'METHOD_NOT_ALLOWED', message: 'Méthode non autorisée' } },
    { status: 405 }
  )
}

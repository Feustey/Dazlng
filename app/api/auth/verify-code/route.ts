import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

const VerifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(4)
})

export async function POST(req: NextRequest): Promise<Response> {
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
        meta: { timestamp: new Date().toISOString(), version: '1.0.0' }
      }, { status: 400 })
    }
    // Chercher le code OTP valide
    const { data: otp, error } = await supabase
      .from('otp_codes')
      .select('*')
      .eq('email', parsed.data.email)
      .eq('code', parsed.data.code)
      .eq('used', false)
      .gt('expires_at', Date.now())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !otp) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Code OTP invalide ou expiré',
          details: error
        },
        meta: { timestamp: new Date().toISOString(), version: '1.0.0' }
      }, { status: 400 })
    }

    // Marquer le code comme utilisé
    await supabase.from('otp_codes').update({ used: true }).eq('id', otp.id)

    // (Optionnel) Créer ou connecter l'utilisateur ici

    return NextResponse.json({
      success: true,
      data: { message: 'Code vérifié' },
      meta: { timestamp: new Date().toISOString(), version: '1.0.0' }
    })
  } catch (e) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur serveur',
        details: e instanceof Error ? e.message : e
      },
      meta: { timestamp: new Date().toISOString(), version: '1.0.0' }
    }, { status: 500 })
  }
} 
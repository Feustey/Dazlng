import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/utils/email'

const SendCodeSchema = z.object({
  email: z.string().email()
})

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json()
    const parsed = SendCodeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email invalide',
          details: parsed.error.flatten()
        },
        meta: { timestamp: new Date().toISOString(), version: '1.0.0' }
      }, { status: 400 })
    }
    // Nettoyage des anciens codes expirés
    await supabase.from('otp_codes').delete().lt('expires_at', Date.now())

    // Générer un code OTP à 6 chiffres
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes

    // Désactiver les anciens codes non utilisés pour cet email
    await supabase.from('otp_codes').update({ used: true }).eq('email', parsed.data.email).eq('used', false)

    // Insérer le nouveau code
    const { error: insertError } = await supabase.from('otp_codes').insert([
      {
        email: parsed.data.email,
        code,
        expires_at: expiresAt,
        used: false,
        attempts: 0
      }
    ])
    if (insertError) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'DATABASE_ERROR',
          message: 'Erreur lors de la création du code OTP',
          details: insertError
        },
        meta: { timestamp: new Date().toISOString(), version: '1.0.0' }
      }, { status: 500 })
    }

    // Envoi de l'email avec le code OTP
    await sendEmail({
      to: parsed.data.email,
      subject: 'Votre code de connexion',
      html: `<p>Votre code de connexion est : <b>${code}</b></p><p>Ce code expire dans 15 minutes.</p>`
    })

    return NextResponse.json({
      success: true,
      data: { message: 'Code envoyé' },
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
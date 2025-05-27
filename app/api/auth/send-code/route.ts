import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'
import { sendEmail } from '@/utils/email'

const SendCodeSchema = z.object({
  email: z.string().email()
})

export async function POST(req: NextRequest): Promise<Response> {
  try {
    console.log("[SEND-CODE] Début de la route");
    const body = await req.json()
    console.log("[SEND-CODE] Body reçu:", body);

    const parsed = SendCodeSchema.safeParse(body)
    if (!parsed.success) {
      console.warn("[SEND-CODE] Validation échouée:", parsed.error.flatten());
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
    console.log("[SEND-CODE] Suppression des anciens codes expirés");
    const { error: deleteError } = await supabase.from('otp_codes').delete().lt('expires_at', Date.now())
    if (deleteError) {
      console.error("[SEND-CODE] Erreur suppression anciens codes:", deleteError);
    }

    // Générer un code OTP à 6 chiffres
    const code = String(Math.floor(100000 + Math.random() * 900000))
    const expiresAt = Date.now() + 15 * 60 * 1000 // 15 minutes
    console.log("[SEND-CODE] Code OTP généré:", code);

    // Désactiver les anciens codes non utilisés pour cet email
    console.log("[SEND-CODE] Désactivation des anciens codes non utilisés");
    const { error: updateError } = await supabase.from('otp_codes').update({ used: true }).eq('email', parsed.data.email).eq('used', false)
    if (updateError) {
      console.error("[SEND-CODE] Erreur update anciens codes:", updateError);
    }

    // Insérer le nouveau code
    console.log("[SEND-CODE] Insertion du nouveau code OTP");
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
      console.error("[SEND-CODE] Erreur d'insertion Supabase:", insertError);
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
    console.log("[SEND-CODE] Envoi de l'email OTP à", parsed.data.email);
    await sendEmail({
      to: parsed.data.email,
      subject: 'Votre code de connexion',
      html: `<p>Votre code de connexion est : <b>${code}</b></p><p>Ce code expire dans 15 minutes.</p>`
    })

    console.log("[SEND-CODE] Succès, code envoyé");
    return NextResponse.json({
      success: true,
      data: { message: 'Code envoyé' },
      meta: { timestamp: new Date().toISOString(), version: '1.0.0' }
    })
  } catch (e) {
    console.error("[SEND-CODE] Exception attrapée:", e);
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
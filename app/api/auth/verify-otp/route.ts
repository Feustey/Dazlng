import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabase'

const VerifyOTPSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6)
})

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json()
    const parsed = VerifyOTPSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Code invalide',
          details: parsed.error.flatten()
        }
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
          message: 'Code OTP invalide ou expiré'
        }
      }, { status: 400 })
    }

    // Marquer le code comme utilisé
    await supabase.from('otp_codes').update({ used: true }).eq('id', otp.id)

    // ✅ CRÉER OU METTRE À JOUR LE PROFIL
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', parsed.data.email)
      .single()

    if (!existingProfile) {
      await supabase.from('profiles').insert([{
        email: parsed.data.email,
        created_at: new Date().toISOString(),
        t4g_tokens: 1
      }])
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Code vérifié avec succès' }
    })

  } catch (e) {
    console.error("[VERIFY-OTP] Erreur:", e);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur serveur'
      }
    }, { status: 500 })
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServerPublicClient } from '@/lib/supabase'

const VerifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().min(6).max(6),
  name: z.string().optional()
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
          message: 'Données invalides',
          details: parsed.error.flatten()
        }
      }, { status: 400 })
    }

    // ✅ Utiliser le client Supabase "public" côté serveur, qui utilise la clé anon.
    const supabase = getSupabaseServerPublicClient();
    
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: parsed.data.email,
      token: parsed.data.code,
      type: 'email',
    })

    if (verifyError) {
      console.error('[VERIFY-CODE] Erreur Supabase:', verifyError)
      return NextResponse.json({
        success: false,
        error: {
          code: 'VERIFICATION_ERROR',
          message: 'Code invalide ou expiré'
        }
      }, { status: 400 })
    }

    console.log('[VERIFY-CODE] Code vérifié avec succès pour:', parsed.data.email)

    return NextResponse.json({
      success: true,
      data: { 
        message: 'Code vérifié avec succès',
        user: data.user 
      }
    })

  } catch (e) {
    console.error("[VERIFY-CODE] Erreur:", e)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur serveur'
      }
    }, { status: 500 })
  }
} 
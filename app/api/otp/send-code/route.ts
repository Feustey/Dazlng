import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServerPublicClient } from '@/lib/supabase'

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

    // ✅ Utiliser le client Supabase "public" côté serveur, qui utilise la clé anon.
    const supabase = getSupabaseServerPublicClient();

    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data.email
    })
    if (error) {
      console.error('Erreur Supabase signInWithOtp:', error)
      return NextResponse.json({
        success: false,
        error: {
          code: 'SUPABASE_ERROR',
          message: error.message
        },
        meta: { timestamp: new Date().toISOString(), version: '1.0.0' }
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: { message: 'Code envoyé via Supabase Auth' },
      meta: { timestamp: new Date().toISOString(), version: '1.0.0' }
    })
  } catch (e) {
    const error = e as Error;
    console.error('Erreur interne API:', error)
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur serveur',
        details: error.message
      },
      meta: { timestamp: new Date().toISOString(), version: '1.0.0' }
    }, { status: 500 })
  }
}

export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

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

    // Utiliser Supabase Auth natif pour envoyer le code OTP
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Variables d\'environnement Supabase manquantes');
    }

    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data.email
    })
    if (error) {
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
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const body = await req.json()
    console.log('[AUTH-LOG]', body)
    
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('[AUTH-LOG] Erreur:', e)
    return NextResponse.json({ success: true }) // Toujours retourner success pour les logs
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Endpoint accessible uniquement en test !
export async function GET(req: NextRequest): Promise<Response> {
  if (process.env.NODE_ENV !== 'test') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email requis' }, { status: 400 });
  }

  // On récupère le dernier code OTP non utilisé et non expiré
  const { data, error } = await supabase
    .from('otp_codes')
    .select('code, expires_at, used')
    .eq('email', email)
    .eq('used', false)
    .gt('expires_at', Date.now())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'OTP non trouvé' }, { status: 404 });
  }

  return NextResponse.json({ code: data.code });
} 
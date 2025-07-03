import { getSupabaseAdminClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) return NextResponse.json({ success: false }, { status: 401 });

  const { data: { user } } = await getSupabaseAdminClient().auth.getUser(token);
  if (!user) return NextResponse.json({ success: false }, { status: 401 });

  // Récupérer les filleuls
  const { data, error } = await getSupabaseAdminClient()
    .from('profiles')
    .select('email, created_at, id')
    .eq('referred_by', user.id);

  if (error) return NextResponse.json({ success: false }, { status: 500 });

  // Pour chaque filleul, vérifier s'il a payé
  const referrals = await Promise.all((data ?? []).map(async (f) => {
    const { count } = await getSupabaseAdminClient()
      .from('orders')
      .select('id', { count: 'exact' })
      .eq('user_id', f.id)
      .eq('payment_status', 'paid');
    return {
      email: f.email,
      joinedAt: f.created_at,
      paid: (count ?? 0) > 0,
    };
  }));

  return NextResponse.json({ success: true, referrals });
}

export const dynamic = "force-dynamic"; 
import { createSupabaseServerClient } from '@/lib/supabase-auth';
import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function POST(request: Request): Promise<Response> {
  const supabase = await createSupabaseServerClient();
  const { pubkey, ref } = await request.json();

  // Récupérer l'utilisateur connecté
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  // Générer un code de parrainage unique si absent
  const referral_code = randomBytes(6).toString('hex');
  let referred_by = null;

  // Si un code referral est passé, retrouver le parrain
  if (ref) {
    const { data: parrain } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', ref)
      .single();
    if (parrain) referred_by = parrain.id;
  }

  // Mettre à jour ou insérer le profil avec les champs de parrainage
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      pubkey,
      nom: '',
      prenom: '',
      updated_at: new Date().toISOString(),
      referral_code,
      referred_by
    }, { onConflict: 'id' });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

export const dynamic = "force-dynamic";

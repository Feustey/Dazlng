import { createSupabaseServerClient } from '@/lib/supabase-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<Response> {
  const supabase = createSupabaseServerClient();
  const { pubkey } = await request.json();

  // Récupérer l'utilisateur connecté
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  // Mettre à jour ou insérer le profil avec des valeurs par défaut
  const { error: upsertError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      email: user.email,
      pubkey,
      nom: '', // Valeur par défaut pour éviter les erreurs
      prenom: '', // Valeur par défaut pour éviter les erreurs
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 
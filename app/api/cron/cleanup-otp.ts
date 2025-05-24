import { supabase } from '@/lib/supabase';

export async function POST(req: Request): Promise<Response> {
  // Vérifier le header d'autorisation (à adapter selon votre système)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Non autorisé', { status: 401 });
  }

  try {
    // Supprimer tous les codes expirés
    const { error, count } = await supabase
      .from('otp_codes')
      .delete()
      .lt('expires_at', Date.now())
      .select('count');

    if (error) {
      console.error('[CLEANUP-OTP] Erreur lors du nettoyage:', error);
      return new Response('Erreur lors du nettoyage', { status: 500 });
    }

    console.log(`[CLEANUP-OTP] ${count} codes expirés supprimés`);
    return new Response(`${count} codes expirés supprimés`, { status: 200 });
  } catch (e) {
    console.error('[CLEANUP-OTP] Erreur inattendue:', e);
    return new Response('Erreur serveur', { status: 500 });
  }
} 
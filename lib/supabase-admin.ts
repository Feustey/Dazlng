// Client Supabase avec clé de service pour les opérations administratives
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Vérification côté serveur uniquement
if (typeof window === 'undefined') {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Configuration Supabase Admin manquante :', {
      url: !!supabaseUrl,
      serviceKey: !!supabaseServiceKey
    });
    throw new Error('Variables d\'environnement Supabase Service Role manquantes');
  }
}

// Client avec clé de service (bypass RLS) - côté serveur uniquement
export const supabaseAdmin = typeof window === 'undefined' && supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Client pour l'authentification côté serveur
export const supabaseServerAuth = typeof window === 'undefined' && supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null; 
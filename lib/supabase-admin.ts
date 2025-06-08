// Client Supabase avec clé de service pour les opérations administratives
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Vérification côté serveur uniquement (sauf pendant le build)
if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Configuration Supabase Admin manquante :', {
      url: !!supabaseUrl,
      serviceKey: !!supabaseServiceKey
    });
    // Ne pas lancer d'erreur pendant le build
    if (process.env.NEXT_PHASE !== 'phase-production-build') {
      console.error('Variables d\'environnement Supabase Service Role manquantes');
    }
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
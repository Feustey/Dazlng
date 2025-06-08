// Client Supabase avec clé de service pour les opérations administratives
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ⚠️ Mode développement : permettre le build même sans service key
const isDevelopment = process.env.NODE_ENV === 'development';
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

if (!supabaseUrl || (!supabaseServiceKey && !isDevelopment && !isBuild)) {
  console.error('Configuration Supabase Admin manquante :', {
    url: !!supabaseUrl,
    serviceKey: !!supabaseServiceKey,
    isDevelopment,
    isBuild
  });
  throw new Error('Variables d\'environnement Supabase Service Role manquantes');
}

// Utiliser une clé factice en développement si nécessaire
const effectiveServiceKey = supabaseServiceKey || (isDevelopment || isBuild ? 'dummy-key-for-build' : '');

// Client avec clé de service (bypass RLS)
export const supabaseAdmin = createClient(supabaseUrl!, effectiveServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client pour l'authentification côté serveur
export const supabaseServerAuth = createClient(supabaseUrl!, effectiveServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}); 
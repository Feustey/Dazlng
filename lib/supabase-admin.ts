// Client Supabase avec clé de service pour les opérations administratives
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key';

// Vérification côté serveur uniquement - warning au lieu d'erreur pour permettre le build
if (typeof window === 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Configuration Supabase Admin manquante :', {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
    });
    console.warn('Variables d\'environnement Supabase Service Role manquantes - certaines fonctionnalités admin ne seront pas disponibles');
  }
}

// Client avec clé de service (bypass RLS) - toujours créer un client pour éviter les erreurs de build
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client pour l'authentification côté serveur
export const supabaseServerAuth = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
}); 
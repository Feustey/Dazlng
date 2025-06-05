// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Configuration Supabase manquante :', {
    url: !!supabaseUrl,
    anonKey: !!supabaseAnonKey,
    serviceKey: !!supabaseServiceKey
  });
  throw new Error('Variables d\'environnement Supabase manquantes. Veuillez configurer NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// ✅ CORRECTIF : Client browser unique pour éviter les multiples instances
let browserClient: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Côté serveur, créer un nouveau client à chaque fois
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // Côté client, réutiliser le même client (singleton)
  if (!browserClient) {
    browserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  
  return browserClient;
}

// Client legacy pour compatibilité (à supprimer progressivement)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});

// Client administrateur pour les opérations serveur qui nécessitent plus de permissions
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Utilitaire pour usage côté serveur (API routes)
export function createServerClient(): SupabaseClient {
  if (!supabaseAdmin) {
    throw new Error('Le client Supabase admin n\'est pas configuré. Vérifiez SUPABASE_SERVICE_ROLE_KEY.');
  }
  return supabaseAdmin;
}

// Export du client browser principal
export const supabaseBrowser = createSupabaseBrowserClient()
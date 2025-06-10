// lib/supabase.ts - Configuration Supabase unifiée
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

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

// ✅ SINGLETON : Une seule instance browser client
let browserClientInstance: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    // Côté serveur, retourner le client admin si disponible
    if (supabaseServiceKey) {
      return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
    }
    
    // Fallback côté serveur avec clé anon
    return createClient(supabaseUrl, supabaseAnonKey);
  }

  // Côté client, singleton strict
  if (!browserClientInstance) {
    browserClientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase Browser Client créé (singleton)');
  }
  
  return browserClientInstance;
}

// ✅ CLIENT PRINCIPAL : Utilisation du singleton
export const supabase = createSupabaseBrowserClient();

// ✅ CLIENT ADMIN : Pour les opérations serveur uniquement
let adminClientInstance: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!supabaseServiceKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY manquante pour le client admin');
  }
  
  if (!adminClientInstance) {
    adminClientInstance = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log('✅ Supabase Admin Client créé (singleton)');
  }
  
  return adminClientInstance;
}

// ✅ EXPORT COMPATIBILITÉ
export const supabaseAdmin = supabaseServiceKey ? getSupabaseAdmin() : null;

// ✅ RESET FUNCTION pour les tests
export function resetSupabaseClients(): void {
  browserClientInstance = null;
  adminClientInstance = null;
  console.log('🔄 Supabase clients reset');
}
// utils/auth-server.ts - Utilitaires d'authentification côté serveur uniquement
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email?: string;
  pubkey?: string;
}

/**
 * Crée un client Supabase serveur avec gestion des cookies
 * À utiliser uniquement dans les Server Components et API Routes
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const cookieStore = await cookies();
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL est manquante dans les variables d\'environnement');
  }
  
  if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY est manquante dans les variables d\'environnement');
  }
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          cookieStore.set({ name, value: '', ...options })
        },
      },
    }
  )
}

/**
 * Récupère l'utilisateur authentifié côté serveur avec cookies
 * À utiliser uniquement dans les Server Components
 */
export async function getUserFromSession(): Promise<AuthUser | null> {
  try {
    const supabaseServer = await createSupabaseServerClient();
    
    const { data: { session }, error } = await supabaseServer.auth.getSession();
    
    if (error || !session?.user) {
      console.log('[AUTH] Pas de session active:', error?.message);
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      pubkey: session.user.user_metadata?.pubkey
    };
  } catch (error) {
    console.error('[AUTH] Erreur lors de la récupération de la session:', error);
    return null;
  }
} 
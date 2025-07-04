// utils/auth-server.ts - Utilitaires d'authentification côté serveur uniquement
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

export interface AuthUser {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  pubkey?: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  compte_x?: string;
  compte_nostr?: string;
  t4g_tokens: number;
  node_id?: string;
  settings?: Record<string, any>;
  verified_at?: string;
}

/**
 * Crée un client Supabase côté serveur avec les cookies de la requête
 */
export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Les cookies ne peuvent être définis que dans un contexte de requête
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Les cookies ne peuvent être supprimés que dans un contexte de requête
          }
        },
      },
    }
  );
}

/**
 * Récupère l'utilisateur authentifié côté serveur
 */
export async function getServerUser(): Promise<AuthUser | null> {
  try {
    const supabase = createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return null;
    }

    // Récupérer les données du profil
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
}

/**
 * Vérifie si l'utilisateur est authentifié côté serveur
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getServerUser();
  return user !== null;
}
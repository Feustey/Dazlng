// lib/supabase.ts - Nouvelle version avec @supabase/ssr
import { createBrowserClient } from '@supabase/ssr';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Utilisation des variables d'environnement publiques pour le client navigateur
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vérification des variables d'environnement requises
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL est manquante dans les variables d\'environnement');
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY est manquante dans les variables d\'environnement');
}

/**
 * Crée un client Supabase pour le CONTEXTE NAVIGATEUR (Client-Side Components).
 * La librairie gère le singleton en interne.
 */
export function getSupabaseBrowserClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Crée un client Supabase pour le CONTEXTE SERVEUR avec des droits PUBLICS.
 * Utilise la clé anonyme pour les opérations publiques côté serveur.
 */
export function getSupabaseServerPublicClient(): SupabaseClient {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Crée un client Supabase pour le CONTEXTE SERVEUR avec des droits d'ADMINISTRATION.
 * ATTENTION : Ce client peut contourner RLS. À n'utiliser que pour des tâches spécifiques
 * dans les Server Actions ou les API Routes où les droits admin sont indispensables.
 */
export function getSupabaseAdminClient(): SupabaseClient {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceKey) {
    throw new Error('La clé de service Supabase (SUPABASE_SERVICE_ROLE_KEY) est manquante côté serveur.');
  }

  // Pour le client admin, nous utilisons createClient classique.
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// NOTE: Les anciens exports `supabase` et `supabaseAdmin` sont supprimés
// pour forcer l'utilisation des nouvelles fonctions et éviter les erreurs.
// Nous allons corriger les fichiers qui les utilisaient dans les prochaines étapes.
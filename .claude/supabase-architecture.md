# Architecture Supabase & Bonnes Pratiques (Next.js + @supabase/ssr)

## 1. Création des clients Supabase
- Utilisez **@supabase/ssr** pour créer les clients adaptés à chaque contexte :
  - `getSupabaseBrowserClient()` pour les composants client React (CSR)
  - `getSupabaseAdminClient()` pour les opérations d'administration côté serveur (API, server actions)
  - Pour la récupération de session côté serveur, utilisez `createServerClient` ou un utilitaire équivalent (voir [lib/supabase-auth.ts])

## 2. Ne jamais exporter de client Supabase pré-initialisé
- N'exportez jamais un client Supabase directement (ex: `export const supabase = ...`).
- Exportez uniquement des **fonctions** qui créent le client à la demande.
- Cela évite les erreurs SSR/CSR et les problèmes de session.

## 3. Utilisation dans les composants React
- Dans les composants client, utilisez le Provider `SupabaseProvider` ([app/providers/SupabaseProvider.tsx]) pour fournir le contexte utilisateur et session.
- Utilisez le hook `useSupabase` du Provider pour accéder à l'utilisateur courant, la session et la fonction de déconnexion.
- Supprimez le hook `lib/hooks/useSupabase.ts` (obsolète).

## 4. Utilisation dans les routes API et server actions
- Dans les routes API (`app/api/**`), créez un client adapté au contexte serveur à chaque appel (voir [lib/supabase.ts]).
- Pour les opérations d'admin (bypass RLS), utilisez `getSupabaseAdminClient()` **uniquement** dans les routes sécurisées.
- Pour les opérations utilisateur, créez un client public avec la clé anonyme et récupérez la session via les cookies de la requête.

## 5. Sécurité & RLS
- Activez et testez les Row Level Security (RLS) sur toutes les tables sensibles.
- Ne JAMAIS exposer la clé `SUPABASE_SERVICE_ROLE_KEY` côté client.
- Les variables `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont sûres côté client.

## 6. Optimisations
- Utilisez des index sur les colonnes fréquemment requêtées (ex: `user_id`, `email`).
- Paginer toutes les requêtes de liste (ex: `.range()` ou `.limit()`).
- Limiter les droits du client anonyme au strict minimum dans le dashboard Supabase.

## 7. Références de fichiers
- [lib/supabase.ts] : Fonctions de création des clients
- [app/providers/SupabaseProvider.tsx] : Provider React pour la session utilisateur
- [lib/supabase-auth.ts] : Utilitaire pour la session côté serveur
- [utils/supabase.ts] : À migrer pour n'utiliser que les fonctions, jamais d'export direct

## 8. À faire lors de la migration
- Migrer tous les fichiers qui importaient un client Supabase direct (`supabase`) pour utiliser la fonction adaptée à leur contexte.
- Supprimer les hooks et utilitaires obsolètes.
- Documenter toute nouvelle convention dans cette règle.

## 9. Plan de migration fichier par fichier

Pour garantir la conformité et la robustesse de l'intégration Supabase, suivez ce plan :

### a) Fichiers à migrer (utilisant un export direct de `supabase`)
- `utils/supabase.ts` : Remplacer tous les usages de `supabase` par un appel à la fonction adaptée au contexte (client ou serveur).
- `lib/hooks/useSupabase.ts` : À supprimer (le Provider suffit).
- `lib/supabase-admin.ts` : Harmoniser avec la fonction `getSupabaseAdminClient`.
- `lib/services/payment-logger.ts` : Créer le client via la fonction adaptée.
- `scripts/quick-health-check.ts` : Créer le client admin via la fonction adaptée.

### b) Fichiers déjà conformes ou à vérifier
- `lib/supabase.ts` : Déjà migré, sert de référence.
- `app/providers/SupabaseProvider.tsx` : Déjà migré, conforme.
- `lib/supabase-auth.ts`, `utils/supabase/server.ts`, `utils/supabase/client.ts`, `utils/supabase/middleware.ts` : Utilisent déjà `@supabase/ssr` ou des patterns corrects, à harmoniser si besoin.

### c) Étapes détaillées
1. Migrer chaque fonction pour créer le client Supabase à la demande (pattern "on-demand").
2. Supprimer les hooks et utilitaires obsolètes.
3. Harmoniser tous les utilitaires serveur/client/middleware pour utiliser les fonctions de création de client adaptées à leur contexte.
4. Documenter toute nouvelle convention dans cette règle.
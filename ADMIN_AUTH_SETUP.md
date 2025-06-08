# Configuration Authentification Admin

## Sécurité Renforcée

L'accès aux routes `/admin` est maintenant protégé par un système d'authentification robuste à double niveau :

### 1. Protection Middleware (Server-side)
Le middleware vérifie l'authentification et les permissions avant même que la page se charge.

### 2. Protection AuthGuard (Client-side) 
Le composant `AuthGuard` vérifie en temps réel l'authentification côté client avec écoute des changements d'état.

## Emails Admin Autorisés

### Production
- `admin@dazno.de`
- `contact@dazno.de` 
- `stephane@dazno.de`
- `support@dazno.de`
- Tout email se terminant par `@dazno.de`

### Développement (en plus des emails production)
- `test@dazno.de`
- `dev@dazno.de`
- `admin@test.com`

## Comment tester en local

### Méthode 1 : Créer un utilisateur de test
```sql
-- Via Supabase SQL Editor
INSERT INTO auth.users (
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'admin@test.com',
  NOW(),
  NOW(),
  NOW()
);
```

### Méthode 2 : Modifier temporairement les permissions
Ajouter votre email de test dans la fonction `checkAdminEmail` :

```typescript
// Dans middleware.ts ou AuthGuard.tsx
const devEmails = [
  'test@dazno.de',
  'dev@dazno.de', 
  'admin@test.com',
  'votre-email@example.com' // Ajouter ici temporairement
]
```

### Méthode 3 : Utiliser l'authentification Magic Link
1. Aller sur `/auth/login`
2. Entrer un email autorisé (ex: `admin@test.com`)
3. Utiliser le système OTP ou magic link de Supabase

## Comportements Sécurisés

### Accès refusé
- Redirection vers `/auth/login?error=admin_access_denied`
- Message d'erreur explicite
- Affichage de l'email actuellement connecté

### Changement d'authentification
- Déconnexion automatique si les permissions changent
- Écoute en temps réel des changements d'état auth
- Revalidation automatique des permissions

### Messages d'erreur
- `admin_access_required` : Non authentifié
- `admin_access_denied` : Authentifié mais pas admin
- `auth_check_failed` : Erreur technique

## Architecture

```
/admin/* (toutes les routes)
    ↓
middleware.ts (vérification serveur)
    ↓
Layout.tsx → AuthGuard.tsx (vérification client)
    ↓
Contenu admin (si autorisé)
```

## Logs de Debugging

En mode développement, les logs suivants apparaissent dans la console :

```
[Middleware] Accès admin autorisé pour: admin@test.com
[AuthGuard] Accès admin autorisé pour: admin@test.com
```

En cas de refus :
```
[Middleware] Accès admin refusé pour: user@example.com
[AuthGuard] Accès admin refusé pour: user@example.com
```

## Variables d'Environnement

Aucune variable supplémentaire requise. Le système utilise `NODE_ENV` pour différencier développement/production.

## Notes Importantes

- **Double protection** : Middleware + AuthGuard pour sécurité maximale
- **Fallback intelligent** : Si une protection échoue, l'autre prend le relais
- **État synchronisé** : Changements d'auth détectés en temps réel
- **UX optimisée** : Messages clairs, loading states, boutons d'action
- **Logs détaillés** : Debugging facile en développement 
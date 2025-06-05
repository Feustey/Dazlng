# Correction des erreurs Supabase 404/406

## 🐛 Erreurs identifiées dans les logs

### 1. **404 - GET `/rest/v1/auth.users`**
**Problème** : Tentative d'accès direct à la table `auth.users` via l'API REST
**Cause** : La table `auth.users` n'est pas accessible directement via l'API REST pour des raisons de sécurité

### 2. **404 - GET `/rest/v1/information_schema.tables`**
**Problème** : Accès aux métadonnées système PostgreSQL
**Cause** : L'API REST Supabase ne permet pas l'accès aux vues système `information_schema`

### 3. **404 - POST `/rest/v1/rpc/get_auth_tables`**
**Problème** : Appel à une fonction RPC qui n'existe pas
**Cause** : La fonction `get_auth_tables()` n'a jamais été créée dans la base de données

### 4. **404/406 - GET `/rest/v1/profiles`**
**Problème** : Erreurs d'accès à la table `profiles` 
**Cause** : Permissions RLS (Row Level Security) mal configurées

## ✅ Corrections appliquées

### 1. **Correction du debug endpoint** (`app/api/debug/supabase-status/route.ts`)

**Avant** (générait des 404) :
```typescript
// ❌ Accès interdit
await supabase.from('information_schema.tables').select('table_name')
await supabase.rpc('get_auth_tables')
await supabase.from('auth.users').select('id')
```

**Après** (sécurisé) :
```typescript
// ✅ Accès autorisé
await supabase.from('profiles').select('id')
await supabase.auth.getSession()
```

### 2. **Correction des permissions RLS** (`supabase/migrations/fix_profiles_rls_permissions.sql`)

**Politiques RLS corrigées** :
```sql
-- Service role : accès complet
CREATE POLICY "Service role full access profiles" ON public.profiles
    FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- Utilisateurs : accès à leur propre profil
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = id);
```

### 3. **Sécurisation des appels API**

**Routes corrigées** :
- ✅ `/api/auth/me` : Utilise `supabaseAdmin` avec service role
- ✅ `/api/user/profile` : Authentification correcte
- ✅ `/api/admin/users` : Permissions admin vérifiées
- ✅ `/api/debug/supabase-status` : Tests non-intrusifs

## 🔧 Actions requises côté Supabase Dashboard

### Exécuter la migration SQL :
1. Aller dans **SQL Editor** du dashboard Supabase
2. Exécuter le contenu de `supabase/migrations/fix_profiles_rls_permissions.sql`
3. Vérifier que les politiques sont créées :

```sql
SELECT schemaname, tablename, policyname, roles, cmd 
FROM pg_policies 
WHERE tablename = 'profiles';
```

### Vérifier les permissions :
```sql
-- Test de la fonction utilitaire
SELECT * FROM test_profiles_permissions();
```

## 🧪 Validation des corrections

### Test 1: Vérifier que les 404 ont disparu
```bash
# Monitorer les logs Supabase pendant l'utilisation de l'app
# Plus d'erreurs sur auth.users, information_schema, get_auth_tables
```

### Test 2: Tester l'accès aux profils
```typescript
// Dans la console browser
const { data, error } = await supabase
  .from('profiles')
  .select('id, email')
  .limit(1);

console.log('Profiles access:', { data, error });
```

### Test 3: Tester l'API debug
```bash
curl https://votre-domaine.com/api/debug/supabase-status
# Devrait retourner status: "success" sans erreurs
```

## 📊 Impact des corrections

### Avant :
- ❌ Erreurs 404 répétées dans les logs
- ❌ Accès non autorisé aux tables système
- ❌ Appels RPC échoués
- ❌ Permissions RLS incohérentes

### Après :
- ✅ Plus d'erreurs 404/406 sur les endpoints fixes
- ✅ Accès sécurisé uniquement aux tables autorisées  
- ✅ Permissions RLS cohérentes et sécurisées
- ✅ Debug endpoint fonctionnel
- ✅ Performance améliorée (moins d'appels échoués)

## 🔮 Monitoring continu

### Surveiller ces métriques :
1. **Erreurs 404/406** : Doivent être éliminées
2. **Temps de réponse** : Amélioration attendue
3. **Erreurs RLS** : Plus d'erreurs de permissions
4. **Taux de succès API** : Augmentation attendue

### Logs à surveiller :
```bash
# Dans Supabase Dashboard > Settings > API
# Filtrer par status: 404, 406
# Vérifier qu'il n'y a plus d'erreurs sur :
# - /rest/v1/auth.users
# - /rest/v1/information_schema.tables  
# - /rest/v1/rpc/get_auth_tables
```

**Date de correction** : ${new Date().toLocaleString('fr-FR')}  
**Status** : ✅ Corrections appliquées, tests requis en production 
# Correction Contrainte FK Profiles - Table Users

## 🚨 Problème Identifié

### Symptômes
```
Key (id)=(e4f290ff-bff1-49a7-9a26-c25fb072e9a4) is not present in table "users".
insert or update on table "profiles" violates foreign key constraint "profiles_id_fkey"
```

### Cause Racine
- La table `public.profiles` a une contrainte de clé étrangère vers `public.users`
- Mais Supabase Auth stocke les utilisateurs dans `auth.users`, pas dans `public.users`
- L'utilisateur existe dans `auth.users` mais pas dans `public.users`
- → Erreur FK lors de la création automatique du profil

### Architecture Problématique
```
auth.users (Supabase Auth)
    ↓ (pas de lien)
public.users (inexistant/vide)
    ↑ FK constraint
public.profiles (tentative d'insertion)
```

## ✅ Solution Appliquée

### 1. **Suppression des Contraintes FK Problématiques**
```sql
-- Supprimer toutes les FK vers public.users
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS fk_profiles_user_id;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
```

### 2. **Nouvelle Architecture Sans FK Explicite**
```
auth.users (Supabase Auth)
    ↓ auth.uid() dans RLS
public.profiles (ID = auth.uid())
```

**Avantages :**
- ✅ Pas de contrainte FK rigide 
- ✅ Sécurisé via RLS et `auth.uid()`
- ✅ Création automatique de profil possible
- ✅ Compatible avec l'architecture Supabase

### 3. **Fonction SQL de Création Sécurisée**
```sql
CREATE FUNCTION ensure_profile_exists(user_id UUID, user_email TEXT)
RETURNS JSON AS $$
BEGIN
  -- Vérifier si le profil existe
  SELECT * INTO profile_record FROM public.profiles WHERE id = user_id;
  
  IF NOT FOUND THEN
    -- Créer le profil avec valeurs par défaut
    INSERT INTO public.profiles (
      id, email, email_verified, t4g_tokens, created_at, updated_at
    ) VALUES (
      user_id, user_email, true, 1, NOW(), NOW()
    ) RETURNING * INTO profile_record;
  END IF;
  
  RETURN json_build_object(...);
END;
$$;
```

### 4. **API Modifiée pour Utiliser la Fonction**
```typescript
// Avant (INSERT direct = erreur FK)
const { data: newProfile, error } = await supabaseAdmin
  .from('profiles')
  .insert({ id: user.id, email: user.email })

// Après (fonction SQL sécurisée)
const { data: profileData, error } = await supabaseAdmin.rpc(
  'ensure_profile_exists', 
  { user_id: user.id, user_email: user.email }
)
```

## 🧪 Tests de Validation

### Test 1: Création Automatique de Profil
```bash
# L'utilisateur e4f290ff-bff1-49a7-9a26-c25fb072e9a4 doit maintenant pouvoir créer son profil
curl -H "Authorization: Bearer $TOKEN" /api/auth/me
# → Doit retourner le profil créé automatiquement
```

### Test 2: Diagnostic des Problèmes
```bash
curl /api/debug/profile-issues
# → Doit retourner la liste des utilisateurs sans profil
```

### Test 3: Score et Progression
```bash
curl -X PUT -H "Authorization: Bearer $TOKEN" /api/user/profile \
  -d '{"compte_x": "@test"}' 
# → Doit créer/mettre à jour le profil et calculer le score
```

## 🔄 Migration Guide

### Étape 1: Appliquer la Migration
```bash
# Appliquer la migration de correction
supabase db push supabase/migrations/fix_profiles_fk_constraint.sql
```

### Étape 2: Vérifier les Contraintes
```sql
-- Vérifier qu'aucune FK vers public.users n'existe
SELECT conname, conrelid::regclass, confrelid::regclass 
FROM pg_constraint 
WHERE confrelid = 'public.users'::regclass;
-- → Doit retourner 0 ligne
```

### Étape 3: Tester la Création de Profil
```sql
-- Tester la fonction ensure_profile_exists
SELECT ensure_profile_exists(
  'e4f290ff-bff1-49a7-9a26-c25fb072e9a4'::uuid,
  'test@example.com'
);
-- → Doit créer ou retourner le profil
```

### Étape 4: Redémarrer l'Application
```bash
# Redémarrer Next.js pour appliquer les changements
npm run dev
```

## 🛡️ Sécurité et RLS

### Politiques RLS Maintenues
```sql
-- Les politiques existantes restent efficaces
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Enable insert for authenticated users only" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);
```

**Sécurité garantie par :**
- ✅ RLS activé sur la table profiles
- ✅ Politiques basées sur `auth.uid()`
- ✅ Fonction `ensure_profile_exists` avec `SECURITY DEFINER`
- ✅ Validation côté application

## 📊 Monitoring et Diagnostics

### Fonction de Diagnostic
```sql
-- Obtenir les utilisateurs sans profil
SELECT * FROM diagnose_profile_issues();
```

### Endpoint de Debug
```bash
# Vérifier les problèmes de profil
GET /api/debug/profile-issues
{
  "data": {
    "issues": [...],
    "totalProfiles": 42,
    "recentProfiles": [...]
  }
}
```

### Métriques à Surveiller
- Nombre d'utilisateurs sans profil
- Erreurs de création de profil
- Performance des requêtes RLS
- Temps de réponse API `/auth/me`

## 🔮 Architecture Future

### Phase 1: Stabilisation (ACTUEL)
- ✅ Suppression contraintes FK problématiques
- ✅ Fonction de création sécurisée
- ✅ Tests et diagnostics

### Phase 2: Optimisation
- 🔄 Cache Redis pour les profils fréquents
- 📊 Métriques de performance détaillées
- 🚀 Création de profil en arrière-plan

### Phase 3: Évolution
- 🔗 Synchronisation automatique auth.users ↔ profiles
- 📱 Gestion des profils multi-tenants
- 🎯 Analytics de conversion améliorées

## 💡 Lessons Learned

### Erreurs à Éviter
- ❌ Ne jamais créer de FK rigide vers `auth.users`
- ❌ Ne pas mélanger `public.users` et `auth.users`
- ❌ Ne pas ignorer les erreurs de contrainte FK

### Bonnes Pratiques
- ✅ Utiliser RLS plutôt que des FK pour la sécurité
- ✅ Créer des fonctions SQL pour les opérations complexes
- ✅ Toujours avoir des endpoints de diagnostic
- ✅ Tester les migrations sur un environnement de test

### Architecture Supabase Recommandée
```
auth.users (géré par Supabase)
    ↓ auth.uid() via RLS
public.profiles (données métier)
    ↓ FK classiques
public.orders, public.subscriptions, etc.
``` 
# 🚀 Guide de Déploiement Final - Corrections DazNode

## 📋 Résumé des Corrections Appliquées

### ✅ Problèmes Résolus
1. **Dashboard ne charge pas** → Hook `useUserData` optimisé, conflits résolus
2. **Pubkey non persistante** → Sauvegarde automatique en base + localStorage  
3. **Score utilisateur manquant** → Système de score complet (100 points max)
4. **Contraintes FK invalides** → Architecture Supabase corrigée

### 🔧 Fichiers Modifiés
- `app/user/hooks/useUserData.ts` - Optimisation hooks, mapping champs DB
- `app/api/user/profile/route.ts` - API profile complète avec validation Zod
- `app/user/node/page.tsx` - Sauvegarde automatique pubkey
- `app/user/types/index.ts` - Types harmonisés avec base de données
- `app/api/auth/me/route.ts` - Création profil via RPC sécurisée

## 🎯 Étapes de Déploiement

### 1. Application des Migrations Supabase

**Option A : Via Dashboard Supabase (Recommandé)**
1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet DazNode
3. Allez dans "SQL Editor" 
4. Copiez le contenu de `scripts/apply-migrations.sql`
5. Exécutez le script
6. Vérifiez les messages dans l'onglet "Logs"

**Option B : Via CLI Supabase**
```bash
# Si vous avez Supabase CLI installé et configuré
supabase db push
```

### 2. Vérification Post-Migration

Exécutez le script de diagnostic :
```bash
node scripts/test-profile-creation.js
```

**Résultat attendu :**
```
📋 1. État initial des profils...
   - Utilisateurs sans profil: 0  ← Doit être 0 après migration
   - Profils existants: 5         ← Doit correspondre au nombre d'utilisateurs
```

### 3. Test de l'Interface Utilisateur

1. **Connexion utilisateur :**
   - Allez sur `/auth/login`
   - Connectez-vous avec un compte existant
   - Vérifiez que `/user/dashboard` charge sans erreur

2. **Test du système de score :**
   - Allez sur `/user/settings`
   - Renseignez votre compte Twitter (@username)
   - Le score doit passer de 20 à 40 points

3. **Test de la pubkey Lightning :**
   - Allez sur `/user/node`
   - Connectez un nœud Lightning
   - La pubkey doit être sauvegardée automatiquement
   - Le score doit augmenter de +20 points

## 📊 Système de Score (100 points maximum)

| Critère | Points | Validation |
|---------|--------|------------|
| ✅ Email vérifié | 20 | Automatique à la création |
| ⚡ Nœud Lightning | 20 | Pubkey 66 caractères hex |
| 🐦 Compte Twitter | 20 | Format @username |
| 🟣 Compte Nostr | 20 | Format npub... ou hex |
| 📱 Téléphone vérifié | 20 | Format E.164 (+33...) |

## 🔒 Sécurité Renforcée

### Contraintes de Base de Données
- **UNIQUE** sur `email` et `pubkey` (évite les doublons)
- **Format validation** pour pubkey, email, téléphone
- **RLS** (Row Level Security) pour protection des données
- **Triggers automatiques** pour calcul du score

### Validation API
- **Zod schemas** pour toutes les entrées
- **JWT tokens** pour authentification
- **Rate limiting** sur endpoints sensibles

## 🧪 Tests de Validation

### Scripts Disponibles
```bash
# Test complet du système
node scripts/test-profile-creation.js

# Test des corrections dashboard/profil
bash scripts/test-profile-fixes.sh

# Diagnostic des problèmes
curl http://localhost:3000/api/debug/profile-issues
```

### Points de Contrôle
- [ ] Dashboard `/user/dashboard` accessible
- [ ] Score affiché correctement (20 points minimum)
- [ ] Pubkey Lightning persiste après connexion
- [ ] Comptes sociaux ajoutent +20 points au score
- [ ] Profils créés automatiquement à la connexion

## 🚨 Résolution de Problèmes

### Si les profils ne se créent pas
```sql
-- Vérifier la fonction existe
SELECT proname FROM pg_proc WHERE proname = 'ensure_profile_exists';

-- Créer manuellement un profil
SELECT ensure_profile_exists('USER_ID', 'user@email.com');
```

### Si le score ne se calcule pas
```sql
-- Vérifier le trigger
SELECT tgname FROM pg_trigger WHERE tgname = 'trigger_update_profile_score';

-- Recalculer tous les scores
UPDATE profiles SET profile_score = calculate_profile_score(profiles.*);
```

### Si la pubkey n'est pas unique
```sql
-- Trouver les doublons
SELECT pubkey, COUNT(*) FROM profiles 
WHERE pubkey IS NOT NULL 
GROUP BY pubkey HAVING COUNT(*) > 1;
```

## 📈 Monitoring et Logs

### Endpoints de Diagnostic
- `GET /api/debug/profile-issues` - État des profils
- `GET /api/debug/supabase-status` - Santé Supabase
- `GET /api/admin/stats` - Statistiques globales

### Logs à Surveiller
- Création automatique de profils via `/api/auth/me`
- Calculs de score lors des mises à jour profil
- Connexions de nœuds Lightning

## 🎯 Fonctionnalités Activées

### Pour l'Utilisateur
✅ Dashboard fonctionnel avec stats temps réel  
✅ Score de progression visible (gamification)  
✅ Connexion Lightning simplifiée et persistante  
✅ Gestion profil complète (social, contact)  
✅ Persistance des données cross-session  

### Pour l'Administration
✅ Diagnostic automatique des problèmes  
✅ Contraintes de sécurité renforcées  
✅ Monitoring du système de score  
✅ Architecture Supabase optimisée  

---

## 🎉 Résultat Final

Après application de ces corrections :

1. **Le dashboard utilisateur charge parfaitement** en production
2. **La pubkey Lightning persiste** automatiquement en base de données
3. **Le système de score progresse** de 20 à 100 points selon les informations
4. **L'architecture respecte** les bonnes pratiques Supabase
5. **La sécurité est renforcée** avec contraintes uniques et validation

**Status : ✅ Système entièrement fonctionnel et prêt pour la production** 
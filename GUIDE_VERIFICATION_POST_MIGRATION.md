# Guide de Vérification Post-Migration CRM

Ce guide détaille comment vérifier que toute l'application fonctionne correctement après la migration CRM d'optimisation.

## 🚀 Scripts de Vérification

### 1. Script Principal de Vérification
```bash
# Installer les dépendances si nécessaire
npm install tsx

# Exécuter le script de vérification complet
npx tsx scripts/verify-post-migration.ts
```

**Ce script vérifie :**
- ✅ Structure de la base de données (tables, vues, fonctions)
- ✅ Contraintes et index
- ✅ Politiques RLS
- ✅ Intégrité des données
- ✅ Performance des requêtes

### 2. Test Spécifique des APIs
```bash
# Démarrer l'application en mode développement
npm run dev

# Dans un autre terminal, exécuter les tests API
npx tsx scripts/test-apis-post-migration.ts
```

**Ce script teste :**
- 🎯 APIs CRM (segments, campaigns)
- 👑 APIs Admin (users, stats, orders)
- 👤 APIs Utilisateur (profile, orders, subscriptions)
- 🔐 APIs d'authentification
- 🔧 APIs de debug
- 📮 APIs Email
- ⚡ Performance des endpoints critiques

## 🔍 Vérifications Manuelles Recommandées

### 1. Interface Admin CRM
1. Se connecter en tant qu'admin
2. Naviguer vers `/admin/crm`
3. Vérifier :
   - ✅ Liste des segments s'affiche
   - ✅ Création d'un nouveau segment
   - ✅ Statistiques des segments
   - ✅ Liste des campagnes email
   - ✅ Création d'une nouvelle campagne

### 2. Profils Utilisateur
1. Accéder à `/user/profile`
2. Vérifier :
   - ✅ Chargement du profil
   - ✅ Modification des informations
   - ✅ Nouveaux champs (Telegram, adresse)
   - ✅ Validation des formats (email, pubkey)

### 3. Admin - Gestion Utilisateurs
1. Accéder à `/admin/users`
2. Vérifier :
   - ✅ Liste des utilisateurs avec statistiques
   - ✅ Filtres et recherche
   - ✅ Performance de chargement
   - ✅ Pagination

### 4. Statistiques et Rapports
1. Accéder à `/admin/analytics`
2. Vérifier :
   - ✅ Chargement des statistiques CRM
   - ✅ Graphiques et métriques
   - ✅ Export des données

## 🛠️ Résolution des Problèmes Courants

### Erreur : "Table not found"
```sql
-- Vérifier que la migration a bien été appliquée
SELECT * FROM information_schema.tables 
WHERE table_name LIKE 'crm_%' 
AND table_schema = 'public';
```

### Erreur : "Function does not exist"
```sql
-- Vérifier les fonctions CRM
SELECT routine_name FROM information_schema.routines 
WHERE routine_name LIKE '%crm%' 
AND routine_schema = 'public';
```

### Performance Dégradée
```sql
-- Vérifier les index
SELECT indexname, tablename FROM pg_indexes 
WHERE schemaname = 'public' 
AND (tablename LIKE 'crm_%' OR tablename = 'profiles');

-- Rafraîchir les vues matérialisées si elles existent
REFRESH MATERIALIZED VIEW CONCURRENTLY crm_segments_stats_simple;
REFRESH MATERIALIZED VIEW CONCURRENTLY crm_campaigns_stats_simple;
```

### Erreur de Contrainte
```sql
-- Vérifier les contraintes sur profiles
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'profiles' 
AND table_schema = 'public';
```

## 📊 Métriques de Réussite

### Performance
- ⚡ Requêtes profiles : < 500ms
- ⚡ APIs CRM : < 1000ms  
- ⚡ Vues matérialisées : < 200ms
- ⚡ Admin users enhanced : < 2000ms

### Fonctionnalité
- ✅ 100% des tests API passent
- ✅ Toutes les contraintes respectées
- ✅ Index optimisés présents
- ✅ RLS configuré correctement

## 🎯 Tests de Charge (Optionnel)

### Test des Segments
```javascript
// Script Node.js pour tester la performance des segments
const testSegmentPerformance = async () => {
  for (let i = 0; i < 100; i++) {
    const start = Date.now();
    await fetch('http://localhost:3000/api/crm/segments');
    console.log(`Test ${i}: ${Date.now() - start}ms`);
  }
};
```

### Test des Utilisateurs Admin
```bash
# Utiliser AB (Apache Bench) pour tester la charge
ab -n 100 -c 10 http://localhost:3000/api/admin/users
```

## 🚨 Actions en Cas de Problème

### Problème Critique (Tests échoués)
1. **Ne pas déployer en production**
2. Analyser les logs d'erreur
3. Revenir à la migration précédente si nécessaire :
   ```sql
   -- Rollback d'urgence (si safe)
   DROP TABLE IF EXISTS crm_customer_segments CASCADE;
   DROP TABLE IF EXISTS crm_customer_segment_members CASCADE;
   -- etc.
   ```

### Problème de Performance
1. Exécuter les index CONCURRENTLY en production :
   ```bash
   npx tsx supabase/migrations/20250105_crm_optimization_indexes_concurrent.sql
   ```
2. Ajuster les requêtes problématiques
3. Configurer la surveillance

### Avertissements Mineurs
1. Documenter les limitations
2. Planifier les optimisations futures
3. Surveiller les métriques

## 📋 Checklist de Validation Finale

### Base de Données
- [ ] Toutes les tables CRM créées
- [ ] Contraintes et index appliqués
- [ ] Fonctions CRM disponibles
- [ ] RLS configuré
- [ ] Vues matérialisées (si safe migration)

### APIs
- [ ] Toutes les routes CRM fonctionnelles
- [ ] Authentification préservée
- [ ] Performance acceptable
- [ ] Gestion d'erreurs opérationnelle

### Interface Utilisateur
- [ ] Admin CRM accessible
- [ ] Formulaires de profil fonctionnels
- [ ] Statistiques affichées
- [ ] Pas d'erreurs JavaScript

### Performance
- [ ] Temps de réponse < seuils définis
- [ ] Pas de régression sur les APIs existantes
- [ ] Index optimisés activés
- [ ] Surveillance configurée

## 🎉 Validation de Production

Une fois tous les tests passés en développement :

1. **Staging** : Reproduire tous les tests
2. **Production** : Migration progressive
3. **Monitoring** : Surveillance active 24h
4. **Documentation** : Mise à jour des guides équipe

## 📞 Support et Escalation

En cas de problème :
1. Consulter les logs d'application
2. Vérifier les métriques Supabase
3. Utiliser les fonctions de diagnostic :
   ```sql
   SELECT * FROM diagnose_crm_simple();
   ```
4. Contacter l'équipe DevOps si nécessaire

---

**Note importante** : Ce guide assume que la migration `20250105_crm_optimization_safe.sql` a été appliquée. Les vérifications peuvent varier selon la version de migration utilisée. 
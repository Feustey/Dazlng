# 🚀 Guide de Déploiement Automatisé - DazNode

Ce guide présente les différents scripts de déploiement automatisés disponibles pour le projet DazNode.

## 📋 Scripts Disponibles

### 1. `deploy:auto` - Déploiement Complet Interactif
**Script:** `scripts/auto-build-and-deploy.sh`

Le script le plus complet avec toutes les vérifications et confirmations utilisateur.

**Fonctionnalités:**
- ✅ Vérification de l'environnement
- ✅ Validation des dépendances
- ✅ Tests TypeScript, ESLint, traductions
- ✅ Build de production
- ✅ Analyse du bundle
- ✅ Test de démarrage (optionnel)
- ✅ Commit et push automatiques
- ✅ Nettoyage et restauration

**Utilisation:**
```bash
npm run deploy:auto
```

**Cas d'usage:**
- Déploiements importants
- Mises à jour majeures
- Quand vous voulez un contrôle total

---

### 2. `deploy:quick` - Déploiement Rapide
**Script:** `scripts/quick-deploy.sh`

Script optimisé pour les déploiements quotidiens rapides.

**Fonctionnalités:**
- ✅ Nettoyage rapide
- ✅ Build de production
- ✅ Commit et push automatiques
- ⚡ Exécution rapide

**Utilisation:**
```bash
npm run deploy:quick
```

**Cas d'usage:**
- Déploiements quotidiens
- Corrections mineures
- Quand vous êtes pressé

---

### 3. `deploy:ci` - Déploiement Non-Interactif
**Script:** `scripts/auto-deploy-non-interactive.sh`

Script optimisé pour l'automatisation CI/CD sans intervention utilisateur.

**Fonctionnalités:**
- ✅ Exécution complètement automatique
- ✅ Vérifications rapides (sans arrêt sur erreur)
- ✅ Build de production
- ✅ Commit et push automatiques
- ✅ Gestion d'erreurs robuste

**Utilisation:**
```bash
# Message de commit par défaut
npm run deploy:ci

# Message de commit personnalisé
npm run deploy:ci "feat: Ajout nouvelle fonctionnalité"
```

**Cas d'usage:**
- Intégration continue (CI/CD)
- Déploiements automatisés
- Pipelines de build

---

## 🔧 Configuration

### Variables d'Environnement Requises
Assurez-vous que ces variables sont configurées :

```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Autres
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=your_nextauth_url
RESEND_API_KEY=your_resend_api_key
```

### Prérequis Système
- Node.js 18+
- npm 9+
- git
- bash

## 📊 Comparaison des Scripts

| Fonctionnalité | `deploy:auto` | `deploy:quick` | `deploy:ci` |
|----------------|---------------|----------------|-------------|
| **Temps estimé** | 5-10 min | 2-3 min | 3-5 min |
| **Interactivité** | ✅ Complète | ⚠️ Limitée | ❌ Aucune |
| **Vérifications** | ✅ Complètes | ⚠️ Basiques | ✅ Rapides |
| **Tests** | ✅ Complets | ❌ Aucun | ⚠️ Rapides |
| **Analyse** | ✅ Bundle | ❌ Aucune | ❌ Aucune |
| **Sécurité** | ✅ Maximale | ⚠️ Moyenne | ✅ Robuste |

## 🎯 Recommandations d'Usage

### Pour le Développement Quotidien
```bash
npm run deploy:quick
```

### Pour les Mises à Jour Importantes
```bash
npm run deploy:auto
```

### Pour l'Automatisation CI/CD
```bash
npm run deploy:ci "feat: $FEATURE_NAME"
```

## 🚨 Gestion des Erreurs

### Erreurs Communes

1. **Build échoué**
   - Vérifiez les erreurs TypeScript
   - Corrigez les problèmes de linting
   - Vérifiez les traductions

2. **Push échoué**
   - Vérifiez votre connexion internet
   - Vérifiez vos permissions git
   - Vérifiez que la branche existe

3. **Tests échoués**
   - Vérifiez la configuration des tests
   - Corrigez les erreurs dans le code
   - Vérifiez les dépendances

### Récupération

Tous les scripts incluent une fonction de nettoyage automatique qui :
- Restaure l'état git précédent
- Nettoie les fichiers temporaires
- Annule les modifications non commitées

## 🔄 Workflow Recommandé

### 1. Développement
```bash
npm run dev
```

### 2. Tests Locaux
```bash
npm run type-check
npm run lint
npm run validate-translations
```

### 3. Déploiement
```bash
# Pour les corrections rapides
npm run deploy:quick

# Pour les mises à jour importantes
npm run deploy:auto
```

### 4. Vérification Post-Déploiement
```bash
npm run health-check
npm run test:mcp-quick
```

## 📈 Monitoring

### Métriques à Surveiller
- Temps de build
- Taille du bundle
- Performance des tests
- Taux de succès des déploiements

### Logs
Tous les scripts génèrent des logs détaillés avec :
- Timestamps
- Statuts colorés
- Messages d'erreur clairs
- Résumés de fin

## 🛠 Personnalisation

### Modifier les Scripts
Les scripts sont modulaires et peuvent être personnalisés :

1. **Ajouter des tests personnalisés**
2. **Modifier les vérifications**
3. **Changer les messages de commit**
4. **Ajouter des notifications**

### Exemple de Personnalisation
```bash
# Dans auto-build-and-deploy.sh
# Ajouter un test personnalisé
print_status "Test personnalisé..."
if npm run test:custom; then
    print_success "Test personnalisé OK"
else
    print_error "Test personnalisé échoué"
    exit 1
fi
```

## 🎉 Conclusion

Ces scripts automatisent complètement le processus de déploiement de DazNode, garantissant :
- ✅ Cohérence des déploiements
- ✅ Réduction des erreurs humaines
- ✅ Gain de temps significatif
- ✅ Traçabilité complète

Choisissez le script adapté à votre contexte et profitez d'un déploiement sans stress ! 🚀 
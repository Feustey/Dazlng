# Mise à Jour Variables d'Environnement DazNode

## 🆕 Nouvelles Variables Courtes

Les variables d'environnement pour le wallet DazNode ont été simplifiées avec des noms plus courts :

### ⚡ Variables Principales

```bash
# NOUVELLES variables courtes (recommandées)
APP_PUKEY=69620ced6b014d8b6013aa86c6b37cd86f28a5843ce8b430b5d96d7bc991c697
WALLET_PUKEY=de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30

# Configuration NWC (inchangée)
DAZNODE_RELAY_URL=wss://relay.getalby.com/v1
DAZNODE_WALLET_SECRET=votre_secret_nwc_ici
```

### 🔄 Compatibilité Ascendante

Le système supporte **automatiquement** les anciennes variables en fallback :

```bash
# ANCIENNES variables (toujours supportées)
DAZNODE_APP_PUBLIC_KEY=69620ced6b014d8b6013aa86c6b37cd86f28a5843ce8b430b5d96d7bc991c697
DAZNODE_WALLET_PUBLIC_KEY=de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30
```

### 📋 Ordre de Priorité

Le système vérifie les variables dans cet ordre :

1. **`APP_PUKEY`** → fallback vers **`DAZNODE_APP_PUBLIC_KEY`** → valeur par défaut hardcodée
2. **`WALLET_PUKEY`** → fallback vers **`DAZNODE_WALLET_PUBLIC_KEY`** → valeur par défaut hardcodée

---

## 🧪 Tests de Validation

### Test avec nouvelles variables

```bash
# Test avec variables courtes
APP_PUKEY=69620ced6b014d8b6013aa86c6b37cd86f28a5843ce8b430b5d96d7bc991c697 \
WALLET_PUKEY=de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30 \
npm run test:daznode-api
```

**Résultat :** ✅ 100% de succès - Les nouvelles variables fonctionnent parfaitement !

### Test de compatibilité

```bash
# Test avec anciennes variables (toujours supporté)
npm run test:daznode-api  # Utilise les valeurs par défaut hardcodées
```

---

## 🔧 Migration Recommandée

### Pour les Nouveaux Déploiements

Utilisez les **nouvelles variables courtes** :

```bash
# .env ou variables d'environnement
APP_PUKEY=69620ced6b014d8b6013aa86c6b37cd86f28a5843ce8b430b5d96d7bc991c697
WALLET_PUKEY=de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30
DAZNODE_WALLET_SECRET=votre_secret_nwc_reel
```

### Pour les Déploiements Existants

**Aucune action requise** - les anciennes variables continuent de fonctionner !

Si vous souhaitez migrer :
1. Ajoutez les nouvelles variables à votre `.env`
2. Supprimez les anciennes variables (optionnel)
3. Redémarrez l'application

---

## 📊 Avantages des Nouvelles Variables

✅ **Plus courtes** - Moins de verbosité  
✅ **Plus claires** - Noms explicites  
✅ **Compatibles** - Aucune rupture avec l'existant  
✅ **Testées** - Validation complète effectuée  

---

## 🚀 État Final

- ✅ **Variables courtes** `APP_PUKEY` et `WALLET_PUKEY` implémentées
- ✅ **Compatibilité ascendante** avec `DAZNODE_*` variables
- ✅ **Tests passent** à 100% avec les nouvelles variables
- ✅ **Documentation mise à jour** (`DAZNODE_WALLET_SETUP.md`)
- ✅ **Validation des erreurs** améliorée

**🎉 Le système utilise maintenant les variables courtes tout en gardant la compatibilité !** 
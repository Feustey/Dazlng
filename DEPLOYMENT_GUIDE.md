# 🚀 GUIDE DE DÉPLOIEMENT MCP LIGHT API

## ✅ **CORRECTION PRÊTE POUR DÉPLOIEMENT**

### **Problème résolu :**
- **Boucle infinie** dans `MCPLightAPI.makeRequest()`
- **Erreur :** `RangeError: Maximum call stack size exceeded`

### **Solution implémentée :**
- Paramètre `skipInitialization` dans `makeRequest()`
- Logique conditionnelle pour éviter la récursion
- Health check sécurisé

## 🧪 **COMMANDES DE TEST DISPONIBLES**

### **1. Test rapide (recommandé)**
```bash
npm run test:mcp-quick
```
**Durée :** ~5 secondes
**Vérifie :** Initialisation, health check, absence de boucle infinie

### **2. Test complet**
```bash
npm run test:mcp-fix
```
**Durée :** ~10 secondes
**Vérifie :** Tous les aspects de l'API MCP

## 🚀 **COMMANDES DE DÉPLOIEMENT**

### **Option 1 : Déploiement sécurisé (RECOMMANDÉ)**
```bash
npm run deploy:mcp-safe
```
**Processus :**
1. ✅ Test automatique de la correction
2. ✅ Vérification git
3. ✅ Commit et push automatiques
4. ✅ Validation du déploiement

### **Option 2 : Déploiement direct**
```bash
npm run deploy:mcp-fix
```
**Processus :**
1. ✅ Commit et push automatiques
2. ⚠️ Pas de test préalable

## 📁 **FICHIERS CRÉÉS/MODIFIÉS**

### **Correction principale :**
- `lib/services/mcp-light-api.ts` - Correction de la boucle infinie

### **Scripts de test :**
- `scripts/test-mcp-fix.ts` - Test complet
- `scripts/quick-mcp-test.ts` - Test rapide

### **Scripts de déploiement :**
- `scripts/execute-deployment.sh` - Déploiement direct
- `scripts/deploy-with-test.sh` - Déploiement sécurisé

### **Documentation :**
- `MCP_FIX_SUMMARY.md` - Résumé de la correction
- `MCP_FIX_COMMIT.md` - Documentation du commit

## 🎯 **WORKFLOW RECOMMANDÉ**

### **Étape 1 : Test de la correction**
```bash
npm run test:mcp-quick
```

### **Étape 2 : Déploiement sécurisé**
```bash
npm run deploy:mcp-safe
```

### **Étape 3 : Vérification post-déploiement**
```bash
npm run dev
# Tester l'application dans le navigateur
```

## 📊 **RÉSULTATS ATTENDUS**

### **Avant la correction :**
```
❌ RangeError: Maximum call stack size exceeded
❌ Boucle infinie dans MCPLightAPI
❌ Application instable
```

### **Après la correction :**
```
✅ Initialisation réussie en XXXms
✅ Health check réussi en XXXms
✅ API MCP opérationnelle
✅ Application stable
```

## 🚨 **EN CAS DE PROBLÈME**

### **Si le test échoue :**
1. Vérifiez les variables d'environnement `DAZNO_API_URL` et `DAZNO_API_KEY`
2. Assurez-vous que l'API api.dazno.de est accessible
3. Vérifiez la connectivité réseau

### **Si le déploiement échoue :**
1. Vérifiez les permissions git
2. Assurez-vous d'être sur la bonne branche
3. Vérifiez la connectivité au repository

## 🌐 **POST-DÉPLOIEMENT**

### **Vérifications recommandées :**
1. **Test de l'application :** `npm run dev`
2. **Test des APIs :** Vérifier les endpoints MCP
3. **Monitoring :** Surveiller les logs pour d'éventuelles erreurs

### **Commandes utiles :**
```bash
# Vérifier l'état de l'application
npm run health-check

# Tester les APIs
npm run test-apis

# Vérifier la configuration
npm run check:dazno-config
```

---

**Status :** ✅ **PRÊT POUR DÉPLOIEMENT**

**Commande recommandée :** `npm run deploy:mcp-safe`

**Priorité :** CRITIQUE ✅ 
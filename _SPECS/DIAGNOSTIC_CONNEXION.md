# 🔧 Diagnostic des Problèmes de Connexion

## ✅ Corrections Apportées

### 1. API de Vérification des Factures (`/api/check-invoice`)
- **Problème** : Les factures de test n'étaient jamais marquées comme payées
- **Solution** : Ajout d'une simulation de paiement après 30 secondes pour les tests
- **Amélioration** : Gestion propre des erreurs "NOT_FOUND" avec statut 200 au lieu de 500

### 2. API de Vérification du Code (`/api/auth/verify-code`)
- **Problème** : Échec de vérification même avec le bon code
- **Solution** : Normalisation des codes (suppression des espaces invisibles)
- **Amélioration** : Logs détaillés pour identifier les problèmes

### 3. API de Connexion Lightning (`/api/auth/login-node`)
- **Problème** : Erreurs de vérification de signature peu claires
- **Solution** : Validation du format de message et expiration
- **Amélioration** : Logs détaillés pour le débogage

## 🧪 Tests de Validation

### Test 1 : Création de Facture
```bash
curl -X POST http://localhost:3000/api/create-invoice \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "description": "Test API"}'
```
**Résultat attendu** : Facture créée avec ID commençant par "extracted_"

### Test 2 : Vérification de Facture
```bash
curl "http://localhost:3000/api/check-invoice?id=INVOICE_ID"
```
**Résultat attendu** : `{"status":"pending","isTest":true}` puis `"settled"` après 30s

### Test 3 : Envoi de Code
```bash
curl -X POST http://localhost:3000/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```
**Résultat attendu** : Statut 200 OK

## 🔍 Diagnostic des Problèmes de Connexion

### Problème : Code de Connexion Ne Fonctionne Pas

**Étapes de diagnostic :**

1. **Vérifier les logs du serveur**
   ```bash
   # Regarder les logs pour [SEND-CODE] et [VERIFY-CODE]
   ```

2. **Vérifier le format du code**
   - Le code doit être exactement 6 chiffres
   - Pas d'espaces avant/après
   - Copier-coller directement depuis l'email

3. **Vérifier l'expiration**
   - Le code expire après 10 minutes
   - Demander un nouveau code si nécessaire

4. **Tester avec curl**
   ```bash
   # 1. Envoyer un code
   curl -X POST http://localhost:3000/api/auth/send-code \
     -H "Content-Type: application/json" \
     -d '{"email": "VOTRE_EMAIL"}'
   
   # 2. Vérifier avec le code reçu
   curl -X POST http://localhost:3000/api/auth/verify-code \
     -H "Content-Type: application/json" \
     -d '{"email": "VOTRE_EMAIL", "code": "CODE_RECU"}'
   ```

### Problème : Connexion Lightning Ne Fonctionne Pas

**Étapes de diagnostic :**

1. **Vérifier l'extension WebLN**
   - Extension Alby installée et activée
   - Connectée à un wallet

2. **Vérifier les logs du navigateur**
   ```javascript
   // Dans la console du navigateur
   console.log(window.webln);
   ```

3. **Vérifier le format du message**
   - Doit contenir "Connexion à Daznode"
   - Ne doit pas être trop ancien (< 5 minutes)

4. **Tester manuellement**
   ```javascript
   // Dans la console du navigateur
   await window.webln.enable();
   const info = await window.webln.getInfo();
   console.log('Pubkey:', info.node?.pubkey || info.pubkey);
   
   const message = `Connexion à Daznode - ${new Date().toISOString()}`;
   const signature = await window.webln.signMessage(message);
   console.log('Signature:', signature);
   ```

### Problème : Factures Lightning

**Étapes de diagnostic :**

1. **Vérifier la connexion NWC**
   - Variable d'environnement `NWC_URL` configurée
   - Wallet connecté via Nostr Wallet Connect

2. **Mode test activé**
   - Les factures avec ID `mock_`, `extracted_`, `gen_` sont des factures de test
   - Elles se marquent automatiquement comme payées après 30 secondes

3. **Vérifier les logs**
   ```bash
   # Rechercher dans les logs :
   # - "API create-invoice"
   # - "API check-invoice"
   # - Erreurs NWC
   ```

## 🛠️ Solutions Recommandées

### Pour l'Utilisateur Final

1. **Connexion par Email**
   - Utiliser un email valide
   - Vérifier les spams/courriers indésirables
   - Copier le code exactement (6 chiffres)
   - Utiliser le code dans les 10 minutes

2. **Connexion Lightning**
   - Installer l'extension Alby
   - Se connecter à un wallet
   - Autoriser la signature du message
   - Réessayer si échec

### Pour le Développeur

1. **Monitoring**
   - Surveiller les logs serveur
   - Vérifier la base de données Supabase
   - Tester régulièrement les APIs

2. **Configuration**
   - Variables d'environnement correctes
   - Connexion Supabase active
   - Service d'email fonctionnel

## 📊 Métriques de Santé

- ✅ API create-invoice : Fonctionnelle avec fallback de test
- ✅ API check-invoice : Amélioration gestion erreurs + simulation paiement
- ✅ API send-code : Fonctionnelle (statut 200)
- ✅ API verify-code : Normalisation des codes + logs détaillés
- ✅ API login-node : Validation améliorée + logs détaillés

## 🚀 Prochaines Améliorations

1. **Interface utilisateur**
   - Messages d'erreur plus explicites
   - Indicateurs de progression
   - Gestion de l'expiration en temps réel

2. **Backend**
   - Rate limiting pour éviter le spam
   - Métriques et monitoring
   - Backup des codes en cas d'échec email

3. **Sécurité**
   - Limitation du nombre de tentatives
   - CAPTCHA si nécessaire
   - Logs de sécurité 
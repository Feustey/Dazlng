# Configuration Wallet DazNode - Guide Complet

## Vue d'ensemble

Ce guide détaille la configuration complète du **wallet DazNode** pour recevoir automatiquement tous les paiements Lightning de l'application DazNode.

Le système utilise **Nostr Wallet Connect (NWC)** pour se connecter au wallet DazNode et gérer les factures Lightning.

---

## 🔑 Clés de Configuration

### Clés publiques DazNode configurées :

```bash
# App Public Key DazNode (nouvelle variable courte)
APP_PUKEY=69620ced6b014d8b6013aa86c6b37cd86f28a5843ce8b430b5d96d7bc991c697

# Wallet Public Key DazNode (nouvelle variable courte)
WALLET_PUKEY=de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30

# Relay Nostr (Alby par défaut)
DAZNODE_RELAY_URL=wss://relay.getalby.com/v1

# Secret de connexion NWC (configurer selon le wallet)
DAZNODE_WALLET_SECRET=votre_secret_nwc_ici
```

---

## 🏗️ Architecture du Système

### Service Lightning Unifié

Le système utilise un **service unifié** qui automatiquement :

1. **Priorise le wallet DazNode** si aucun nœud LND n'est configuré
2. **Fallback vers LND** si les variables d'environnement LND sont présentes
3. **Gère les erreurs** et bascule automatiquement entre providers

### Composants créés :

```
lib/services/
├── daznode-wallet-service.ts     # Service wallet DazNode (NWC)
├── unified-lightning-service.ts   # Service unifié (DazNode + LND)
└── lightning-service.ts          # Service LND natif (fallback)
```

---

## 📋 Variables d'Environnement

### Variables DazNode (Prioritaires)

**⚡ Nouvelles variables courtes (recommandées) :**

```bash
# Clés publiques DazNode (nouvelles variables courtes)
APP_PUKEY=69620ced6b014d8b6013aa86c6b37cd86f28a5843ce8b430b5d96d7bc991c697
WALLET_PUKEY=de79365f2b0b81561d7eb12963173a80a3e78ff0c88262dcdde0118a9deb8e30

# Configuration NWC
DAZNODE_RELAY_URL=wss://relay.getalby.com/v1
DAZNODE_WALLET_SECRET=your_nwc_secret_here
```

**🔄 Compatibilité avec anciennes variables :**
Le système supporte automatiquement les anciennes variables `DAZNODE_APP_PUBLIC_KEY` et `DAZNODE_WALLET_PUBLIC_KEY` en fallback.

### Variables LND (Optionnelles - Fallback)

```bash
# Si ces variables sont présentes, LND sera utilisé
LND_TLS_CERT=base64_encoded_cert
LND_ADMIN_MACAROON=base64_encoded_macaroon
LND_SOCKET=127.0.0.1:10009
```

---

## 🚀 Fonctionnement Automatique

### Ordre de Priorité des Providers

1. **Vérification LND** : Si `LND_TLS_CERT` et `LND_ADMIN_MACAROON` sont configurés
   - ✅ Utilise le nœud LND local
   - ❌ Fallback vers DazNode si erreur

2. **Utilisation DazNode** : Si LND non configuré ou erreur
   - ✅ Utilise le wallet DazNode via NWC
   - ❌ Erreur si wallet DazNode inaccessible

### Endpoints API Automatiques

Tous les endpoints utilisent automatiquement le bon provider :

- `/api/create-invoice` → Génère facture sur wallet actif
- `/api/check-invoice` → Vérifie statut sur wallet actif
- `/api/check-payment` → Utilise le service unifié

---

## 🧪 Tests et Validation

### Test complet du wallet DazNode

```bash
npm run test:daznode-wallet
```

### Tests inclus :

1. ✅ **Validation des clés** publiques DazNode
2. ✅ **Initialisation service** DazNode direct
3. ✅ **Connexion wallet** et informations
4. ✅ **Service unifié** utilise DazNode
5. ✅ **Génération factures** via service unifié
6. ✅ **Vérification statuts** factures
7. ✅ **Endpoints API** utilisent DazNode
8. ✅ **Validation BOLT11** des factures

### Exemple de résultat attendu :

```
🧪 TEST WALLET DAZNODE v2.0
=======================================

✅ App Public Key DazNode
   69620ced6b014d8b60... (configuré)

✅ Wallet Public Key DazNode  
   de79365f2b0b81561d... (configuré)

✅ Service DazNode initialisé
   Connexion NWC configurée

✅ Service unifié utilise DazNode
   Provider détecté: daznode

📊 RÉSUMÉ TEST WALLET DAZNODE
==============================
Total des tests: 9
✅ Tests réussis: 9
❌ Tests échoués: 0
📈 Taux de réussite: 100%

🎉 WALLET DAZNODE PARFAITEMENT CONFIGURÉ !
```

---

## 🔧 Configuration Avancée

### Personnalisation du Secret NWC

Pour configurer votre propre secret NWC :

1. **Générer un secret** dans votre wallet Alby/NWC
2. **Ajouter la variable** d'environnement :
   ```bash
   DAZNODE_WALLET_SECRET=votre_nouveau_secret
   ```
3. **Redémarrer l'application**

### Configuration Relay Personnalisé

```bash
# Utiliser un autre relay Nostr
DAZNODE_RELAY_URL=wss://votre-relay.com/v1
```

---

## 📊 Monitoring et Logs

### Logs automatiques du système :

```javascript
// Service unifié - Détection provider
✅ UnifiedLightning - Utilisation du wallet DazNode

// Génération facture
📄 DazNodeWallet - Génération facture: { amount: 1000, description: "..." }
✅ DazNodeWallet - Facture créée: { id: "abc123...", amount: 1000 }

// Vérification statut
🔍 DazNodeWallet - Vérification statut: abc123...
✅ DazNodeWallet - Statut vérifié: pending
```

### Surveillance en temps réel

Les endpoints API retournent automatiquement le provider utilisé :

```json
{
  "success": true,
  "data": { "invoice": {...} },
  "meta": {
    "provider": "daznode",
    "version": "2.0",
    "timestamp": "2024-01-01T12:00:00Z"
  }
}
```

---

## 🔒 Sécurité

### Clés publiques (Safe to share)

- ✅ **App Public Key** : Peut être partagée publiquement
- ✅ **Wallet Public Key** : Peut être partagée publiquement

### Secrets privés (Keep secret)

- 🔐 **DAZNODE_WALLET_SECRET** : Ne jamais exposer
- 🔐 **Variables LND** : Garder secrètes

### Validation automatique

Le système valide automatiquement :

- Format des clés publiques (64 caractères hex)
- Connectivité au relay Nostr
- Authentification NWC
- Format des factures BOLT11

---

## 🚨 Troubleshooting

### Erreurs communes

**Erreur : "Impossible de se connecter au wallet DazNode"**
```bash
# Vérifier la connectivité
curl -I wss://relay.getalby.com/v1

# Vérifier les variables
echo $WALLET_PUKEY
echo $DAZNODE_WALLET_SECRET
```

**Erreur : "Facture invalide reçue du wallet DazNode"**
```bash
# Tester directement le service
npm run test:daznode-wallet
```

**Provider utilisé : "lnd" au lieu de "daznode"**
```bash
# Supprimer les variables LND pour forcer DazNode
unset LND_TLS_CERT
unset LND_ADMIN_MACAROON
```

### Support technique

En cas de problème :

1. **Lancer les tests** : `npm run test:daznode-wallet`
2. **Vérifier les logs** de l'application
3. **Valider la connectivité** au relay Alby
4. **Vérifier le secret NWC** dans votre wallet

---

## 🎯 Résumé

✅ **Wallet DazNode configuré** avec les clés fournies  
✅ **Service unifié** bascule automatiquement  
✅ **Tous les paiements** arrivent sur le wallet DazNode  
✅ **Tests complets** pour validation  
✅ **Monitoring** et logs détaillés  
✅ **Fallback LND** si besoin  

🎉 **Le système est maintenant prêt à recevoir des paiements Lightning sur le wallet DazNode !** 
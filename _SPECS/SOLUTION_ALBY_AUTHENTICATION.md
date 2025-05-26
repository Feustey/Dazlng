# Solution pour l'Authentification Lightning avec Alby

## 🚨 Problème rencontré

Depuis une mise à jour récente, Alby affiche l'erreur suivante lors de l'authentification Lightning :

```
Erreur: SignMessage is not supported by Alby accounts. 
Generate a Master Key to use LNURL auth.
```

## 📋 Cause du problème

Alby a changé sa politique de sécurité et ne supporte plus la méthode `signMessage` pour les comptes standards. Cette méthode était utilisée pour l'authentification par signature de message.

## ✅ Solutions implémentées

### 1. Authentification LNURL-auth (recommandée)

L'application a été mise à jour pour utiliser l'authentification LNURL-auth qui est compatible avec la nouvelle politique d'Alby :

- **Endpoint API** : `/api/auth/lnurl-auth`
- **Méthode** : Génération d'un challenge cryptographique
- **Compatibilité** : Tous les wallets Lightning modernes

### 2. Solutions pour les utilisateurs

#### Option A : Configurer une Master Key dans Alby

1. Ouvrez l'extension Alby
2. Allez dans les paramètres
3. Activez "Master Key" ou "Advanced Mode"
4. Réessayez l'authentification

#### Option B : Utiliser un autre wallet Lightning

Wallets compatibles avec LNURL-auth :
- **Zeus** ⚡ (mobile/desktop)
- **BlueWallet** 📱 (mobile)
- **Phoenix** 🔥 (mobile)
- **Breez** 💨 (mobile)
- **Muun** 🌙 (mobile)

#### Option C : Authentification par email

Si l'authentification Lightning pose problème, utilisez l'authentification par email/code à usage unique qui reste disponible.

### 3. QR Code de secours

Un composant QR code a été ajouté pour permettre l'authentification via d'autres wallets Lightning :

```tsx
<LNURLAuthQR 
  challenge={challenge}
  onSuccess={(token) => handleAuthSuccess(token)}
  onError={(error) => handleAuthError(error)}
/>
```

## 🔧 Détails techniques

### Flux d'authentification LNURL-auth

1. **Génération du challenge** : L'application génère un identifiant unique
2. **Création de l'URL LNURL** : Encodage en base64 de l'endpoint d'authentification  
3. **Signature par le wallet** : Le wallet signe le challenge avec la clé privée
4. **Vérification** : L'application vérifie la signature et authentifie l'utilisateur

### Code d'implémentation

```typescript
// Génération du challenge
const challenge = `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Création de l'URL LNURL-auth
const authUrl = `${domain}/api/auth/lnurl-auth?challenge=${challenge}`;
const lnurlAuth = `lightning:lnurl${btoa(authUrl).replace(/=/g, '')}`;

// Utilisation avec WebLN
if (window.webln && 'lnurl' in window.webln) {
  await window.webln.lnurl(lnurlAuth);
}
```

## 📱 Interface utilisateur

L'interface d'authentification affiche maintenant :

1. **Message d'aide** explicatif sur le problème Alby
2. **Solutions alternatives** proposées
3. **QR code LNURL** pour l'authentification mobile
4. **Fallback** vers l'authentification email

## 🔍 Tests et validation

Pour tester l'authentification Lightning :

1. **Avec Alby + Master Key** : Doit fonctionner normalement
2. **Avec Zeus/BlueWallet** : Scanner le QR code LNURL
3. **Avec Phoenix/Breez** : Utiliser le lien LNURL directement
4. **Mode fallback** : Authentification par email

## 📞 Support utilisateur

Si un utilisateur rencontre encore des problèmes :

1. Vérifier que son wallet supporte LNURL-auth
2. Proposer l'authentification par email en alternative
3. Recommander Zeus ou BlueWallet pour l'authentification Lightning
4. Diriger vers la documentation Alby pour configurer la Master Key

## 🔄 Prochaines améliorations

- [ ] Intégration avec d'autres méthodes d'authentification Lightning
- [ ] Support pour Nostr-based authentication
- [ ] Interface améliorée pour le choix du wallet
- [ ] Cache distribué (Redis) pour les challenges en production 
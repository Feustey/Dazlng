# 🔗 Guide de connexion à votre nœud Lightning

## 📋 Situation actuelle

Vous avez fourni les informations suivantes de votre nœud Lightning :
- **Host** : `xyfhsompwmbzgyannjyt`
- **Port** : `10009`
- **Macaroon** : ✅ Converti en base64 et prêt
- **Socket** : `xyfhsompwmbzgyannjyt:10009`

## 🔍 Diagnostic

L'adresse `xyfhsompwmbzgyannjyt` semble être une adresse **Tor/onion** raccourcie ou un identifiant spécial qui ne peut pas être résolu par DNS standard.

### Erreur observée :
```
Name resolution failed for target dns:xyfhsompwmbzgyannjyt:10009
```

## 🛠️ Solutions possibles

### 1. **Obtenir le certificat TLS complet**

Dans votre interface Lightning, cherchez un bouton ou lien pour :
- "Download TLS Certificate"
- "Download tls.cert"
- "Certificate Download"
- Un fichier nommé `tls.cert`

Une fois téléchargé, convertissez-le :
```bash
base64 -w0 tls.cert
```

### 2. **Vérifier l'adresse complète**

L'adresse pourrait être :
- `xyfhsompwmbzgyannjyt.onion:10009` (adresse Tor complète)
- Une adresse IP cachée derrière cet identifiant
- Un tunnel/proxy qui nécessite une configuration spéciale

### 3. **Configuration avec adresse complète**

Si c'est une adresse Tor, vous aurez besoin de :

#### Option A : Proxy Tor
```bash
# Installer Tor
brew install tor

# Démarrer Tor
tor
```

#### Option B : Tunnel SSH
```bash
# Si vous avez accès SSH au serveur
ssh -L 10009:localhost:10009 user@votre-serveur
```

#### Option C : URL LNDConnect complète
Copiez l'URL complète `lndconnect://...` depuis votre interface et décodez-la.

## 🎯 Configuration DazNode

Une fois que vous avez les bonnes informations, ajoutez à votre `.env` :

```env
# Certificat TLS (à obtenir depuis votre interface)
DAZNODE_TLS_CERT=LS0tLS1CRUdJTi...

# Macaroon (déjà converti)
DAZNODE_ADMIN_MACAROON=AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghmZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh+P8KRYP/8=

# Socket (à adapter selon votre configuration réseau)
DAZNODE_SOCKET=xyfhsompwmbzgyannjyt:10009
# ou
DAZNODE_SOCKET=xyfhsompwmbzgyannjyt.onion:10009
# ou
DAZNODE_SOCKET=localhost:10009  # si tunnel configuré
```

## 🧪 Test de connexion

```bash
npm run test:daznode-lightning
```

## 🆘 Aide supplémentaire

Si vous pouvez fournir :
1. **Le certificat TLS complet** (fichier `tls.cert`)
2. **L'URL LNDConnect complète** (commence par `lndconnect://`)
3. **Le type de configuration** (Tor, VPN, local, cloud, etc.)

Je pourrai vous aider à configurer la connexion exacte.

## 📱 Alternative : Utiliser l'URL LNDConnect

Si vous avez l'URL LNDConnect complète, vous pouvez :
1. L'utiliser directement avec Zeus, BlueWallet, etc.
2. La décoder pour extraire cert + macaroon + host
3. L'adapter pour DazNode

---

**💡 L'objectif est de connecter votre application DazNode à votre nœud Lightning personnel pour gérer les paiements !** 
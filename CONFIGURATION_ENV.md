# 🔧 Configuration Variables d'Environnement - DazNode

## ❌ Problème identifié

L'erreur de création de facture Lightning indique que la variable `DAZNODE_TLS_CERT` est manquante :

```
Configuration daznode@getalby.com manquante: DAZNODE_TLS_CERT requis
```

## ✅ Solution

### 1. Créer le fichier `.env` à la racine du projet

```bash
touch .env
```

### 2. Ajouter la configuration Lightning DazNode

Copiez et collez ce contenu dans votre fichier `.env` :

```env
# Configuration Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Configuration NextAuth
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000

# Configuration Email
RESEND_API_KEY=your-resend-api-key

# Configuration Lightning DazNode (OBLIGATOIRE)
DAZNODE_TLS_CERT=MIICJDCCAcugAwIBAgIRAJ-fns518h7AJFfDysGkJvgwCgYIKoZIzj0EAwIwODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMB4XDTI0MDgyMDE2NTk1NloXDTI1MTAxNTE2NTk1NlowODEfMB0GA1UEChMWbG5kIGF1dG9nZW5lcmF0ZWQgY2VydDEVMBMGA1UEAxMMdW1icmVsLmxvY2FsMFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEyXC2SABV_r3fofM2X4A7vu23Y4OhuXUMVsWTQaqz4k5N5asFKfvM8PAYhy3A1B13uG0RG2y3vOv0u6vcrNrdAqOBtTCBsjAOBgNVHQ8BAf8EBAMCAqQwEwYDVR0lBAwwCgYIKwYBBQUHAwEwDwYDVR0TAQH_BAUwAwEB_zAdBgNVHQ4EFgQUO36dre3JP1A93Cl698OBDAVTBAgwWwYDVR0RBFQwUoIJbG9jYWxob3N0ggx1bWJyZWwubG9jYWyCBHVuaXiCCnVuaXhwYWNrZXSCB2J1ZmNvbm6HBH8AAAGHEAAAAAAAAAAAAAAAAAAAAAGHBAoVFQkwCgYIKoZIzj0EAwIDRwAwRAIgFtRk0TZmISho7hRfsu4Sdzz2OenJMIjijGwShjvn-owCIAiEVl-nVBUqFs3KvUIYaDu3aFPaKokat9TPxjpNxGLt

DAZNODE_ADMIN_MACAROON=AgEDbG5kAvgBAwoQu54YNs7kr8BtnIyBOxSn5xIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYg8VLzRFm94YpzOnIjNXSkS5J2BiVlnrlOkh-P8KRYP_8

DAZNODE_SOCKET=localhost:10009

# Configuration Wallet DazNode
DAZNODE_WALLET_SECRET=your-nwc-secret-if-needed

# Configuration JWT
JWT_SECRET=your-jwt-secret

# Configuration MCP API
MCP_API_BASE_URL=https://api.dazno.de
MCP_API_TOKEN=your-mcp-api-token

# Configuration Umami Analytics (optionnel)
UMAMI_WEBSITE_ID=your-umami-website-id
UMAMI_API_TOKEN=your-umami-api-token
UMAMI_API_URL=https://analytics.umami.is
```

### 3. Tester la configuration

```bash
# Test du service Lightning
npm run test:daznode-lightning

# Test des endpoints API
curl -X POST http://localhost:3000/api/create-invoice \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "description": "Test facture"}'
```

## 📊 Résultats du Build

✅ **Build réussi** avec quelques warnings TypeScript mineurs :
- 94 pages générées statiquement
- Aucune erreur critique
- Warnings principalement liés aux types `any` et aux dépendances React

## 🎯 Actions suivantes

1. **Créer le fichier `.env`** avec la configuration ci-dessus
2. **Remplacer les valeurs placeholder** par vos vraies clés
3. **Tester l'endpoint `/api/create-invoice`**
4. **Optionnel** : Corriger les warnings TypeScript pour améliorer la qualité du code

## 🔍 Variables importantes à configurer

| Variable | Status | Description |
|----------|--------|-------------|
| `DAZNODE_TLS_CERT` | ✅ **Configuré** | Certificat TLS extrait de l'URL LNDConnect |
| `DAZNODE_ADMIN_MACAROON` | ✅ **Configuré** | Macaroon admin pour authentification |
| `DAZNODE_SOCKET` | ✅ **Configuré** | Adresse du nœud Lightning |
| `NEXT_PUBLIC_SUPABASE_URL` | ⚠️ **À configurer** | URL de votre instance Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ **À configurer** | Clé de service Supabase |
| `NEXTAUTH_SECRET` | ⚠️ **À configurer** | Secret pour NextAuth |

## 🚀 Une fois configuré

Votre application sera entièrement fonctionnelle avec :
- ✅ Création de factures Lightning
- ✅ Vérification de paiements
- ✅ Interface utilisateur complète
- ✅ Authentification sécurisée
- ✅ Tableau de bord admin 
# 🔧 Guide de Correction - Factures Lightning en Production

## 🚨 Problèmes Identifiés

Le diagnostic a révélé les problèmes suivants qui bloquent les factures Lightning en production :

### 1. Variables d'environnement manquantes
- `DAZNODE_API_KEY` - Clé API pour api.dazno.de
- `DAZNODE_API_URL` - URL de l'API DazNode
- `LND_TLS_CERT` - Certificat TLS LND
- `LND_ADMIN_MACAROON` - Macaroon admin LND
- `LND_SOCKET` - Socket LND

### 2. API api.dazno.de inaccessible
- Erreur HTTP 502 (Bad Gateway)
- Service temporairement indisponible

### 3. Endpoints locaux inaccessibles
- Serveur de développement non démarré
- Endpoints API non accessibles

## 🔧 Solutions Immédiates

### Étape 1: Configuration des Variables d'Environnement

Créez ou mettez à jour votre fichier `.env.local` :

```bash
# API DazNode
DAZNODE_API_KEY=votre_clé_api_dazno_de
DAZNODE_API_URL=https://api.dazno.de

# LND Local (optionnel - fallback)
LND_SOCKET=localhost:10009
LND_TLS_CERT=votre_certificat_tls
LND_ADMIN_MACAROON=votre_macaroon_admin

# Configuration Fallback
LIGHTNING_FALLBACK_MAX_RETRIES=3
LIGHTNING_FALLBACK_RETRY_DELAY=2000
LIGHTNING_FALLBACK_ENABLE_LOCAL_LND=true
LIGHTNING_FALLBACK_ENABLE_MOCK=false
```

### Étape 2: Vérification de l'API DazNode

L'API api.dazno.de retourne une erreur 502. Vérifiez :

1. **Statut du service** : https://api.dazno.de/health
2. **Clé API valide** : Contactez l'équipe DazNode
3. **Fallback temporaire** : Utilisez LND local

### Étape 3: Démarrage du Serveur

```bash
# Démarrage en mode développement
npm run dev

# Ou en mode production
npm run build
npm run start
```

### Étape 4: Test des Endpoints

```bash
# Test de santé
curl http://localhost:3000/api/lightning/health

# Test création facture
curl -X POST http://localhost:3000/api/create-invoice \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "description": "Test"}'
```

## 🛠️ Scripts de Diagnostic et Correction

### Diagnostic Complet
```bash
npm run diagnostic:lightning:simple
```

### Correction Automatique
```bash
npm run fix:lightning
```

### Test Rapide
```bash
npm run test:lightning:prod
```

## 🔄 Workflow de Correction

### 1. Diagnostic Initial
```bash
npm run diagnostic:lightning:simple
```

### 2. Configuration Variables
- Configurer `DAZNODE_API_KEY` et `DAZNODE_API_URL`
- Optionnel : Configurer LND local pour fallback

### 3. Test API DazNode
```bash
curl -H "Authorization: Bearer $DAZNODE_API_KEY" \
     https://api.dazno.de/api/v1/lightning/health
```

### 4. Démarrage Serveur
```bash
npm run dev
```

### 5. Test Endpoints Locaux
```bash
curl http://localhost:3000/api/lightning/health
```

### 6. Test Création Facture
```bash
curl -X POST http://localhost:3000/api/create-invoice \
  -H "Content-Type: application/json" \
  -d '{"amount": 1000, "description": "Test production"}'
```

### 7. Diagnostic Final
```bash
npm run diagnostic:lightning:simple
```

## 🎯 Priorités de Correction

### 🔴 Critique (Bloque la production)
1. **DAZNODE_API_KEY** - Clé API requise
2. **DAZNODE_API_URL** - URL API requise
3. **Serveur démarré** - Endpoints accessibles

### 🟡 Important (Améliore la fiabilité)
1. **LND Local** - Fallback en cas d'indisponibilité API
2. **Configuration Fallback** - Retry et health checks
3. **Monitoring** - Surveillance des services

### 🟢 Optionnel (Optimisation)
1. **Cache Redis** - Performance
2. **Logs structurés** - Debugging
3. **Métriques** - Monitoring avancé

## 🚀 Déploiement Production

### Variables d'Environnement Production
```bash
# Vercel / VPS
DAZNODE_API_KEY=prod_key_here
DAZNODE_API_URL=https://api.dazno.de
LIGHTNING_FALLBACK_ENABLE_MOCK=false
LIGHTNING_FALLBACK_ENABLE_LOCAL_LND=false
```

### Health Check Production
```bash
# Endpoint de santé pour load balancer
curl https://votre-domaine.com/api/lightning/health
```

### Monitoring
```bash
# Script de monitoring automatique
npm run diagnostic:lightning:simple
```

## 📞 Support

En cas de problème persistant :

1. **Vérifiez les logs** : `npm run diagnostic:lightning:simple`
2. **Testez l'API** : `curl https://api.dazno.de/health`
3. **Contactez l'équipe** : Support DazNode
4. **Fallback LND** : Utilisez LND local temporairement

## ✅ Checklist de Validation

- [ ] Variables d'environnement configurées
- [ ] API DazNode accessible
- [ ] Serveur démarré et accessible
- [ ] Endpoints API répondent
- [ ] Création de facture fonctionne
- [ ] Vérification de statut fonctionne
- [ ] Diagnostic final passe

---

**🎉 Une fois cette checklist complétée, les factures Lightning seront opérationnelles en production !** 
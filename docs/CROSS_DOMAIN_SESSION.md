# Système de Partage de Session Cross-Domain - Token For Good

## Vue d'ensemble

Ce système permet aux utilisateurs connectés sur DazNode de rejoindre Token For Good sans avoir à se reconnecter, en utilisant un partage de session sécurisé via cookies cross-domain et tokens JWT.

## Architecture

### 1. Configuration Cross-Domain

**Fichier :** `lib/supabase-config.ts`

```typescript
export const CROSS_DOMAIN_CONFIG = {
  ALLOWED_DOMAINS: [
    'https://app.token-for-good.com',
    'https://token-for-good.com',
    'https://dazeno.de',
    'https://www.dazeno.de'
  ],
  
  COOKIE_CONFIG: {
    domain: '.dazeno.de',
    sameSite: 'None',
    secure: true,
    httpOnly: false,
    maxAge: 3600,
    path: '/'
  },
  
  CORS_CONFIG: {
    origin: 'https://app.token-for-good.com',
    credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  }
}
```

### 2. Service de Gestion des Sessions

**Fichier :** `lib/services/cross-domain-session.ts`

Le service `CrossDomainSessionService` fournit :

- `verifySession()` - Vérification session via cookie Supabase
- `verifyBearerToken()` - Vérification token JWT Bearer
- `generateTokenForGood()` - Génération JWT pour Token For Good
- `createTokenForGoodRedirect()` - Création URL de redirection avec token
- `getCorsHeaders()` - Headers CORS pour Token For Good

### 3. Endpoints API

#### `/api/auth/verify-session`

**Méthodes :**
- `GET` - Vérification session via cookie
- `POST` - Vérification session via Bearer token
- `OPTIONS` - Support CORS preflight

**Réponses :**

✅ **Authentifié :**
```json
{
  "authenticated": true,
  "user": {
    "id": "user-123",
    "email": "user@dazeno.de",
    "name": "John Doe"
  }
}
```

❌ **Non authentifié :**
```http
HTTP/1.1 302 Found
Location: https://app.token-for-good.com/login
```

#### `/api/auth/redirect-token-for-good`

**Méthodes :**
- `GET` - Redirection avec token JWT si authentifié
- `OPTIONS` - Support CORS preflight

**Comportement :**
- Si authentifié : redirection vers `https://app.token-for-good.com/login?token=JWT_TOKEN`
- Si non authentifié : redirection vers `https://app.token-for-good.com/login`

## Sécurité

### 1. Tokens JWT

- **Signature :** HMAC SHA256 avec `JWT_SECRET`
- **Audience :** `token-for-good.com`
- **Émetteur :** `dazeno.de`
- **Expiration :** 1 heure
- **Contenu :** `{ id, email, name }`

### 2. Cookies Cross-Domain

- **Domain :** `.dazeno.de` (partage entre sous-domaines)
- **SameSite :** `None` (requis pour cross-domain)
- **Secure :** `true` (HTTPS uniquement)
- **HttpOnly :** `false` (accès côté client autorisé)

### 3. Headers CORS

```http
Access-Control-Allow-Origin: https://app.token-for-good.com
Access-Control-Allow-Credentials: true
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With
```

## Utilisation

### 1. Côté DazNode

**Vérification de session :**
```javascript
// GET /api/auth/verify-session
const response = await fetch('/api/auth/verify-session', {
  credentials: 'include'
});

if (response.ok) {
  const { authenticated, user } = await response.json();
  if (authenticated) {
    // Utilisateur connecté
    console.log('Utilisateur:', user);
  }
}
```

**Redirection avec token :**
```javascript
// GET /api/auth/redirect-token-for-good
window.location.href = '/api/auth/redirect-token-for-good';
```

### 2. Côté Token For Good

**Récupération du token depuis l'URL :**
```javascript
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

if (token) {
  // Vérifier le token avec l'API DazNode
  const response = await fetch('https://dazeno.de/api/auth/verify-session', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const { authenticated, user } = await response.json();
    if (authenticated) {
      // Connecter l'utilisateur automatiquement
      console.log('Connexion automatique:', user);
    }
  }
}
```

## Tests

### Script de test

```bash
npm run test:cross-domain-session
```

**Tests inclus :**
1. Vérification session
2. Génération token JWT
3. Vérification token JWT
4. URL de redirection
5. Headers CORS

### Tests manuels

**Vérification session :**
```bash
curl -X GET http://localhost:3000/api/auth/verify-session \
  -H "Cookie: your-session-cookie"
```

**Vérification Bearer token :**
```bash
curl -X POST http://localhost:3000/api/auth/verify-session \
  -H "Authorization: Bearer your-jwt-token"
```

**Redirection avec token :**
```bash
curl -X GET http://localhost:3000/api/auth/redirect-token-for-good \
  -H "Cookie: your-session-cookie" \
  -I
```

## Configuration Requise

### Variables d'environnement

```env
# JWT Secret (requis)
JWT_SECRET=your-secret-key-here

# Supabase (déjà configuré)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Configuration Supabase

1. **Dashboard Supabase :**
   - Authentication > Settings
   - JWT expiry time: 3600 (1 heure)
   - Refresh token expiry time: 3600 (1 heure)

2. **Politiques RLS :**
   - Table `profiles` accessible en lecture pour les utilisateurs authentifiés

## Dépannage

### Erreurs courantes

1. **CORS errors :**
   - Vérifier que `app.token-for-good.com` est dans `ALLOWED_DOMAINS`
   - S'assurer que les headers CORS sont présents

2. **Token invalide :**
   - Vérifier `JWT_SECRET` côté serveur
   - Contrôler l'expiration du token (1 heure)
   - Valider l'audience (`token-for-good.com`)

3. **Session non trouvée :**
   - Vérifier que l'utilisateur est connecté sur DazNode
   - Contrôler les cookies de session Supabase
   - Valider la configuration cross-domain

### Logs

Les erreurs sont loggées avec le préfixe `❌` :
- `❌ Erreur vérification session cross-domain`
- `❌ Erreur vérification Bearer token`
- `❌ Erreur vérification token Token For Good`

## Évolutions futures

1. **Refresh automatique :** Renouvellement automatique des tokens
2. **Multi-domaines :** Support d'autres domaines partenaires
3. **Audit trail :** Logs détaillés des connexions cross-domain
4. **Rate limiting :** Protection contre les abus
5. **Monitoring :** Métriques de performance et d'usage

---

**Statut :** ✅ Implémentation complète et testée  
**Dernière mise à jour :** ${new Date().toLocaleDateString('fr-FR')} 
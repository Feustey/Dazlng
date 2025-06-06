# Intégration API DazNo - Documentation

## 🚀 Vue d'ensemble

L'intégration API DazNo permet à DazNode de récupérer des données en temps réel et des recommandations IA pour les nœuds Lightning Network. Cette intégration remplace les données mockées par de vraies analyses de performance.

## 📡 Endpoints API

### Base URL
- **Production :** `https://api.dazno.de`
- **Développement :** `http://localhost:8080` (serveur mock)

### Endpoints disponibles

#### 1. Health Check
```
GET /health
```
Vérifier la santé de l'API.

**Réponse :**
```json
{
  "status": "healthy",
  "timestamp": "2025-06-05T18:08:54.905Z",
  "version": "1.0.0",
  "uptime": 105.180413791
}
```

#### 2. Informations du nœud
```
GET /api/v1/node/{pubkey}/info
```
Récupérer les statistiques détaillées d'un nœud Lightning.

**Paramètres :**
- `pubkey` : Clé publique du nœud (66 caractères hexadécimaux)

**Réponse :**
```json
{
  "pubkey": "03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f",
  "alias": "ACINQ",
  "capacity": 85430000,
  "channels": 156,
  "uptime": 99.95,
  "health_score": 98,
  "efficiency": 92,
  "rank": 12,
  "network_size": 18650
}
```

#### 3. Recommandations IA
```
GET /api/v1/node/{pubkey}/recommendations
```
Obtenir des recommandations personnalisées pour optimiser un nœud.

**Réponse :**
```json
[
  {
    "id": "rec_001",
    "title": "Ouvrir un canal avec LNBig",
    "description": "Améliorer votre connectivité en vous connectant à un hub majeur du réseau",
    "impact": "high",
    "difficulty": "easy",
    "priority": 1,
    "estimated_gain": 8500,
    "category": "liquidity",
    "action_type": "open_channel",
    "free": true
  }
]
```

#### 4. Actions prioritaires
```
POST /api/v1/node/{pubkey}/priorities
```
Générer une liste d'actions prioritaires basées sur l'IA.

**Body :**
```json
{
  "actions": ["optimize", "rebalance"]
}
```

**Réponse :**
```json
[
  {
    "action": "increase_routing_fees",
    "priority": 1,
    "estimated_impact": 12000,
    "reasoning": "Avec un health score de 98%, vous pouvez augmenter vos frais de 15% sans perdre de trafic"
  }
]
```

## 🔧 Intégration dans DazNode

### Client API (`lib/dazno-api.ts`)

```typescript
import { daznoApi, mapDaznoRecommendationToLocal, mapNodeInfoToStats } from '@/lib/dazno-api';

// Récupérer les informations d'un nœud
const nodeInfo = await daznoApi.getNodeInfo(pubkey);
const stats = mapNodeInfoToStats(nodeInfo);

// Récupérer les recommandations
const apiRecs = await daznoApi.getRecommendations(pubkey);
const recommendations = apiRecs.map(mapDaznoRecommendationToLocal);

// Vérifier la santé de l'API
const isHealthy = await checkApiHealth();
```

### Configuration d'environnement

```env
# .env.local
NEXT_PUBLIC_DAZNO_API_URL=https://api.dazno.de
```

Pour le développement avec serveur mock :
```env
# .env.local (dev)
NEXT_PUBLIC_DAZNO_API_URL=http://localhost:8080
```

### Hook utilisateur mis à jour

Le hook `useUserData` intègre automatiquement l'API :

```typescript
// app/user/hooks/useUserData.ts
const { userProfile, nodeStats, recommendations } = useUserData();

// nodeStats contient les vraies données si pubkey valide
// recommendations contient les recommandations IA
```

## 🛡️ Gestion des erreurs et fallback

### Stratégie de robustesse

1. **Validation des pubkeys :** Vérification 66 caractères hexadécimaux
2. **Fallback automatique :** Si l'API est indisponible, utilisation de données par défaut
3. **Retry logic :** Tentatives automatiques en cas d'erreur temporaire
4. **Mode dégradé :** Interface utilisateur adaptée quand l'API est down

### Widget de statut API

```tsx
// app/user/components/ui/ApiStatusWidget.tsx
<ApiStatusWidget className="mb-6" />
```

Affiche en temps réel :
- 🟢 API disponible + fonctionnalités actives
- 🔴 API indisponible + mode dégradé
- 🟡 Vérification en cours

## 🧪 Tests et développement

### Serveur mock pour développement

```bash
# Lancer le serveur mock
node scripts/simple-mock-server.js

# Serveur disponible sur http://localhost:8080
```

### Scripts de test

```bash
# Test complet de tous les endpoints
./scripts/test-endpoints.sh

# Test de l'intégration Next.js
curl http://localhost:3000/api/dazno/test | jq
```

### Clés publiques de test

```
ACINQ:  03864ef025fde8fb587d989186ce6a4a186895ee44a926bfc370e2c366597a3f8f
BitMEX: 026165850492521f4ac8abd9bd8088123446d126f648ca35e60f88177dc149ceb2d
```

## 📊 Types TypeScript

### Interfaces principales

```typescript
interface NodeInfo {
  pubkey: string;
  alias?: string;
  capacity?: number;
  channels?: number;
  uptime?: number;
  health_score?: number;
  efficiency?: number;
  rank?: number;
  network_size?: number;
}

interface DaznoRecommendation {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  difficulty: 'easy' | 'medium' | 'hard';
  priority: number;
  estimated_gain?: number;
  category: string;
  action_type: string;
  free: boolean;
}
```

## 🔄 Migration vers production

### Étapes de déploiement

1. **Mise à jour variable d'environnement :**
   ```env
   NEXT_PUBLIC_DAZNO_API_URL=https://api.dazno.de
   ```

2. **Vérification endpoints :** S'assurer que tous les endpoints sont déployés

3. **Tests de connectivité :** Vérifier `/api/dazno/test` en production

4. **Monitoring :** Surveiller les logs d'erreurs API

### Validation de l'intégration

- ✅ Health check successful
- ✅ Node info retrieval
- ✅ Recommendations loading
- ✅ Priority actions generation
- ✅ Fallback behavior
- ✅ Error handling
- ✅ TypeScript types
- ✅ UI components

## 📈 Avantages de l'intégration

1. **Données en temps réel :** Statistiques actualisées des nœuds
2. **Recommandations IA :** Conseils personnalisés pour optimiser les performances
3. **Actions prioritaires :** Intelligence artificielle pour prioriser les améliorations
4. **Expérience utilisateur :** Interface riche avec vraies données vs mockées
5. **Évolutivité :** Architecture prête pour de nouvelles fonctionnalités API

## 🚨 Dépannage

### Problèmes courants

**API indisponible :**
- Vérifier `NEXT_PUBLIC_DAZNO_API_URL`
- Contrôler les logs réseau
- Tester avec serveur mock

**Données vides :**
- Vérifier format pubkey (66 caractères hex)
- Contrôler permissions CORS
- Vérifier authentification si requise

**Performance lente :**
- Implémenter mise en cache
- Optimiser fréquence des appels
- Utiliser pagination si nécessaire 
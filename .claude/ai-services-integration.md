# Intégration des Services IA - DazNode

Cette documentation décrit l'implémentation réelle des services d'intelligence artificielle dans DazNode.

## 🤖 Services IA Implémentés

### Claude AI (Anthropic)
- **Service principal** : Dazia IA pour recommandations personnalisées
- **Configuration** : `@anthropic-ai/sdk` v0.55.0
- **Endpoint** : `app/api/claude/route.ts`
- **Usage** : Génération de recommandations Lightning Network contextuelles

### OpenAI Integration
- **Monitoring** : Métriques temps réel des API OpenAI
- **Endpoints** :
  - `app/api/admin/openai/metrics/route.ts` - Métriques globales
  - `app/api/admin/openai/metrics/realtime/route.ts` - Données temps réel
  - `app/api/admin/openai/health/route.ts` - Santé des services
- **Dashboard** : Interface admin pour suivi des performances IA

### RAG (Retrieval-Augmented Generation)
- **Service** : `app/api/proxy/rag/documents/route.ts`
- **Page utilisateur** : `app/user/rag-insights/page.tsx`
- **Fonctionnalité** : Analyse documentaire contextuelle pour optimisation nœuds

## 🎯 Dazia IA - Système de Recommandations

### Architecture
```typescript
// Page principale Dazia
app/user/dazia/page.tsx

// Composants spécialisés
app/user/dazia/components/
├── RecommendationCard.tsx     // Cartes de recommandations
├── RecommendationFilters.tsx  // Filtres et tri
├── DaziaHeader.tsx           // Header avec stats
├── AdvancedStats.tsx         // Statistiques avancées
└── PerformanceMetrics.tsx    // Métriques de performance
```

### API et Génération
- **Endpoint principal** : `app/api/user/dazia/generate-recommendation/route.ts`
- **Modèle freemium** : 
  - Utilisateurs gratuits : 4 premières recommandations complètes + floutes
  - Utilisateurs premium : Toutes les recommandations débloquées
- **Personnalisation** : Basée sur les données réelles du nœud Lightning

## 🔧 DAZNO API - Intelligence Lightning Network

### Services d'analyse avancée
```typescript
// API DAZNO complète
app/api/dazno/
├── complete/[pubkey]/route.ts           // Analyse complète nœud
├── info/[pubkey]/route.ts               // Informations de base
├── recommendations/[pubkey]/route.ts    // Recommandations spécifiques
├── priorities/[pubkey]/route.ts         // Priorités d'optimisation
├── priorities-enhanced/[pubkey]/route.ts // Priorités avancées
├── reliability/[pubkey]/route.ts        // Analyse de fiabilité
├── bottlenecks/[pubkey]/route.ts       // Détection de goulots
├── dazflow/[pubkey]/route.ts           // Analyse DazFlow
├── optimize-dazflow/route.ts           // Optimisation DazFlow
├── test/route.ts                       // Tests de connectivité
└── network-health/route.ts            // Santé du réseau
```

### Services client
- **Client principal** : `lib/services/dazno-api.ts`
- **Client optimisé** : `lib/services/dazno-api-only.ts`
- **Configuration** : Variables d'environnement sécurisées

## 📊 Proxy Services - APIs Externes

### Architecture des proxies
```typescript
app/api/proxy/
├── channels/recommendations/
│   ├── amboss/route.ts               // Recommandations Amboss
│   └── unified/route.ts              // Recommandations unifiées
├── metrics/
│   ├── dashboard/route.ts            // Métriques dashboard
│   └── prometheus/route.ts           // Métriques Prometheus
├── node/[pubkey]/
│   ├── route.ts                      // Infos nœud général
│   └── info/amboss/route.ts         // Infos Amboss
├── simulate/
│   ├── node/route.ts                // Simulation nœud
│   ├── optimize/route.ts            // Optimisation
│   └── profiles/route.ts            // Profils de simulation
├── intelligence/route.ts             // Intelligence avancée
└── lnbits/route.ts                  // Proxy LNbits
```

## 🎮 Gamification et Engagement IA

### Système de scoring intelligent
- **Composant** : `app/user/components/ui/GamificationCenter.tsx`
- **API** : `app/api/user/crm-data/route.ts`
- **Algorithme** : Scoring basé sur :
  - Completion du profil
  - Adoption Lightning Network
  - Engagement avec les recommandations IA
  - Performance du nœud

### Recommandations intelligentes
- **Composant principal** : `app/user/components/ui/SmartRecommendations.tsx`
- **Composant avancé** : `app/user/components/ui/EnhancedRecommendations.tsx`
- **Logique** : Adaptation en temps réel selon le comportement utilisateur

## 🧠 Intelligence Artificielle Contextuelle

### Page Intelligence
- **Route** : `app/user/intelligence/page.tsx`
- **Fonctionnalités** :
  - Analyse prédictive des performances
  - Détection d'anomalies
  - Recommandations proactives
  - Alertes intelligentes

### Simulation avancée
- **Page** : `app/user/simulation/page.tsx`
- **Capacités** :
  - Simulation de performance en temps réel
  - Modélisation de scénarios
  - Prédictions de revenus
  - Optimisation automatique

## 🔔 Système d'Alertes Intelligent

### Alertes automatisées
- **Page** : `app/user/alerts/page.tsx`
- **Types d'alertes** :
  - Performance dégradée
  - Opportunités d'optimisation
  - Problèmes de connectivité
  - Recommendations urgentes

## 🏗️ Architecture Technique

### Services de base
```typescript
// Services techniques principaux
lib/services/
├── daznode-recommendation-service.ts  // Recommandations DazNode
├── daznode-performance-service.ts     // Performance monitoring
├── EmailConversionService.ts          // Conversion email IA
├── umami-service.ts                   // Analytics avancées
└── mcp-light-api.ts                   // API MCP Light
```

### Intégrations externes
- **Amboss** : Données Lightning Network enrichies
- **LNbits** : Intégration wallet et paiements
- **Prometheus** : Métriques système
- **Custom APIs** : Services propriétaires d'analyse

## 🎯 Recommandations Développement

### Patterns IA
1. **Validation des entrées** : Toujours valider les pubkeys et données
2. **Cache intelligent** : Mise en cache des recommandations coûteuses
3. **Fallbacks gracieux** : Gestion des pannes des services externes
4. **Personnalisation** : Adapter selon le niveau utilisateur (free/premium)

### Monitoring et observabilité
1. **Métriques temps réel** : Tracking des performances IA
2. **Alertes système** : Surveillance des services critiques
3. **Analytics utilisateur** : Comportement et engagement
4. **A/B Testing** : Tests de nouvelles fonctionnalités IA

---

**💡 Note importante** : L'intégration IA de DazNode est sophistiquée et enterprise-ready, avec multiple services d'intelligence artificielle travaillant en synergie pour optimiser l'expérience Lightning Network.
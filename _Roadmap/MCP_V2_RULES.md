# 🚀 RÈGLES DE DÉVELOPPEMENT MCP V2

## 📋 PRINCIPES GÉNÉRAUX

### Architecture & Standards

1. **Modularité & Découpage**
   - Services indépendants et découplés
   - Interfaces clairement définies
   - Injection de dépendances systématique

2. **TypeScript & Types**
   - Types stricts et exhaustifs
   - Interfaces pour tous les modèles de données
   - Validation Zod systématique

3. **Base de données**
   - Schémas PostgreSQL avec contraintes
   - Indexes optimisés
   - Triggers de maintenance automatique

4. **API REST**
   - Format de réponse standardisé
   - Validation des entrées
   - Documentation OpenAPI/Swagger

## 🎯 RÈGLES PAR MODULE

### 1. MCP Yield Finance

#### 1.1 Architecture
- Service `MCPYieldService` unique pour la gestion du yield
- Modèles ML isolés dans `YieldPredictionModel`
- Pipeline de données dans `DataPipeline`

#### 1.2 Standards de Code
```typescript
// ✅ CORRECT - Service avec injection de dépendances
class YieldService implements MCPYieldService {
  constructor(
    private predictionModel: YieldPredictionModel,
    private dataPipeline: DataPipeline
  ) {}
}

// ❌ INCORRECT - Couplage fort
class YieldService {
  private predictionModel = new YieldPredictionModel();
}
```

#### 1.3 Validation des Données
```typescript
// ✅ CORRECT - Schéma Zod complet
const YieldStrategySchema = z.object({
  type: z.enum(['liquidity_provider', 'channel_fees', 'hybrid']),
  amount: z.number().min(1000), // min 1000 sats
  risk_tolerance: z.enum(['low', 'medium', 'high']),
  timeframe: z.string().regex(/^\d+[dMy]$/), // ex: 30d, 6M, 1y
});

// ❌ INCORRECT - Validation manuelle
if (strategy.amount < 1000) throw new Error('Invalid amount');
```

### 2. MCP Liquidity Subscriptions

#### 2.1 Architecture
- Service `MCPLiquidityService` pour la gestion des abonnements
- Monitoring temps réel avec WebSocket
- Optimisation automatique avec ML

#### 2.2 Standards de Code
```typescript
// ✅ CORRECT - Monitoring temps réel
class LiquidityMonitor {
  @WebSocketHandler('channel_update')
  async onChannelUpdate(update: ChannelUpdate) {
    await this.analyzeUpdate(update);
    await this.notifySubscribers(update);
  }
}

// ❌ INCORRECT - Polling
setInterval(() => {
  this.checkChannels();
}, 5000);
```

#### 2.3 Base de données
```sql
-- ✅ CORRECT - Index composé avec condition
CREATE INDEX liquidity_monitoring_idx 
ON channel_updates (node_id, timestamp DESC)
WHERE status = 'active';

-- ❌ INCORRECT - Index simple
CREATE INDEX timestamp_idx ON channel_updates (timestamp);
```

### 3. MCP Marketplace & IA

#### 3.1 Architecture
- Service `MCPMarketplaceService` pour le marketplace
- IA intégrée via `MarketplaceAI`
- Système de matching temps réel

#### 3.2 Standards de Code
```typescript
// ✅ CORRECT - Matching intelligent
async function findMatches(listing: ChannelListing): Promise<Match[]> {
  const score = await this.ai.calculateMatchScore(listing);
  return this.filterByScore(score);
}

// ❌ INCORRECT - Matching simple
return channels.filter(c => c.capacity >= required);
```

### 4. MCP LINER Index

#### 4.1 Architecture
- Service `MCPLinerService` pour l'index
- Calcul temps réel avec cache Redis
- Prédictions ML pour tendances

#### 4.2 Standards de Code
```typescript
// ✅ CORRECT - Cache intelligent
@CacheDecorator({ ttl: '5m', invalidateOn: 'market_update' })
async calculateIndex(): Promise<LinerIndex> {
  return this.computeIndex();
}

// ❌ INCORRECT - Pas de cache
async getIndex(): Promise<LinerIndex> {
  return this.computeIndex();
}
```

## 🔒 SÉCURITÉ

### 1. Authentification
```typescript
// ✅ CORRECT - JWT sécurisé
const token = jwt.sign(payload, privateKey, {
  algorithm: 'ES256',
  expiresIn: '24h'
});

// ❌ INCORRECT - JWT non sécurisé
const token = jwt.sign(payload, secret);
```

### 2. Validation
```typescript
// ✅ CORRECT - Validation complète
const validated = await validateRequestBody(req, schema);
const result = await handleRequest(validated);

// ❌ INCORRECT - Pas de validation
const data = await req.json();
const result = await handleRequest(data);
```

## 📊 MONITORING

### 1. Métriques
```typescript
// ✅ CORRECT - Métriques détaillées
metrics.histogram('yield_calculation_duration', duration, {
  strategy: strategy.type,
  risk_level: strategy.risk_tolerance
});

// ❌ INCORRECT - Métrique simple
metrics.counter('calculations').inc();
```

### 2. Logging
```typescript
// ✅ CORRECT - Logging structuré
logger.info('Yield strategy executed', {
  strategy_id: id,
  type: type,
  amount: amount,
  duration: duration
});

// ❌ INCORRECT - Log simple
console.log(`Strategy ${id} executed`);
```

## 🚀 DÉPLOIEMENT

### 1. Migrations
```sql
-- ✅ CORRECT - Migration avec rollback
BEGIN;
CREATE TABLE new_table (...);
INSERT INTO new_table SELECT * FROM old_table;
DROP TABLE old_table;
COMMIT;

-- ❌ INCORRECT - Migration sans transaction
CREATE TABLE new_table (...);
DROP TABLE old_table;
```

### 2. Configuration
```typescript
// ✅ CORRECT - Config typée
interface Config {
  readonly REDIS_URL: string;
  readonly JWT_SECRET: string;
  readonly API_VERSION: string;
}

// ❌ INCORRECT - Config non typée
const config = process.env;
``` 
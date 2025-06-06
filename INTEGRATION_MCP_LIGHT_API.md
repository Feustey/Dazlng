# 🚀 Intégration MCP-Light API - DazNode

## 📋 Vue d'ensemble

L'intégration MCP-Light API permet à DazNode d'analyser les nœuds Lightning Network en utilisant :
- **SparkSeer** : Données et métriques en temps réel du réseau Lightning
- **OpenAI** : Analyse intelligente et recommandations personnalisées
- **Authentification JWT** : Sécurisation des appels API

## 🏗️ Architecture

### Composants créés

1. **Service API** : `lib/services/mcp-light-api.ts`
   - Client TypeScript pour l'API MCP-Light
   - Gestion automatique de l'authentification JWT
   - Méthodes pour l'analyse complète des nœuds

2. **Hook React** : `hooks/useMCPLight.ts`
   - Hook personnalisé pour l'utilisation dans les composants React
   - Gestion d'état (loading, error, initialized)
   - Méthodes simplifiées pour l'analyse

3. **Composant UI** : `components/shared/NodeAnalysis.tsx`
   - Interface utilisateur pour l'analyse de nœuds
   - Affichage des recommandations SparkSeer
   - Visualisation des actions prioritaires OpenAI

4. **Page de démonstration** : `app/network/mcp-analysis/page.tsx`
   - Interface complète pour tester l'intégration
   - Formulaire de saisie de pubkey
   - Monitoring de l'état de l'API

5. **Route API de test** : `app/api/mcp-light/test/route.ts`
   - Endpoint pour tester l'intégration côté serveur
   - Vérification de santé de l'API
   - Tests d'analyse de nœuds

## 🔧 Configuration

### Variables d'environnement

Ajoutez dans votre `.env.local` :

```env
NEXT_PUBLIC_DAZNO_API_URL=https://api.dazno.de
```

### Vercel Configuration

**Important** : Ajoutez `/auth/credentials` à l'OPTIONS Allowlist dans Vercel pour permettre l'authentification JWT.

## 🚀 Utilisation

### 1. Hook React

```typescript
import { useMCPLight } from '@/hooks/useMCPLight';

function MyComponent() {
  const { analyzeNode, initialized, loading, error } = useMCPLight();

  const handleAnalyze = async () => {
    try {
      const result = await analyzeNode(
        'pubkey_du_noeud',
        'Je veux optimiser mes revenus',
        ['increase_revenue', 'improve_centrality']
      );
      console.log('Analyse:', result);
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return (
    <div>
      {initialized ? (
        <button onClick={handleAnalyze}>Analyser</button>
      ) : (
        <p>Initialisation...</p>
      )}
    </div>
  );
}
```

### 2. Composant NodeAnalysis

```typescript
import NodeAnalysis from '@/components/shared/NodeAnalysis';

function AnalysisPage() {
  return (
    <NodeAnalysis 
      pubkey="02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b"
      onAnalysisComplete={(result) => {
        console.log('Analyse terminée:', result);
      }}
      userContext="Je veux optimiser les performances de mon nœud"
      userGoals={['increase_revenue', 'improve_centrality']}
    />
  );
}
```

### 3. API directe

```typescript
import { mcpLightAPI } from '@/lib/services/mcp-light-api';

// Initialiser l'API
await mcpLightAPI.initialize();

// Analyser un nœud
const analysis = await mcpLightAPI.analyzeNode(
  'pubkey_du_noeud',
  'Contexte utilisateur',
  ['increase_revenue']
);

// Vérifier la santé de l'API
const health = await mcpLightAPI.checkHealth();
```

## 📊 Structure des données

### NodeAnalysisResult

```typescript
interface NodeAnalysisResult {
  pubkey: string;
  timestamp: string;
  nodeInfo: MCPNodeInfo;
  recommendations: MCPRecommendationsResponse;
  priorities: MCPPrioritiesResponse;
  summary: NodeSummary;
}
```

### Recommandations SparkSeer

```typescript
interface SparkSeerRecommendation {
  type: string;
  priority: 'low' | 'medium' | 'high';
  reasoning?: string;
  expected_benefit?: string;
  confidence_score?: number;
}
```

### Actions prioritaires OpenAI

```typescript
interface PriorityAction {
  priority: number;
  action: string;
  timeline: string;
  expected_impact: string;
  difficulty: 'low' | 'medium' | 'high';
}
```

## 🧪 Tests

### Page de démonstration

Accédez à `/network/mcp-analysis` pour tester l'interface utilisateur complète.

### API de test

```bash
# Test GET - Vérification de santé
curl https://votre-domaine.com/api/mcp-light/test

# Test GET avec analyse d'un nœud
curl "https://votre-domaine.com/api/mcp-light/test?pubkey=02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b"

# Test POST - Analyse complète
curl -X POST https://votre-domaine.com/api/mcp-light/test \
  -H "Content-Type: application/json" \
  -d '{
    "pubkey": "02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b",
    "context": "Test d'\''analyse",
    "goals": ["increase_revenue", "improve_centrality"]
  }'
```

## 🔍 Fonctionnalités

### ✅ Implémentées

- [x] Service API MCP-Light avec authentification JWT
- [x] Hook React pour l'utilisation dans les composants
- [x] Composant UI pour l'analyse de nœuds
- [x] Page de démonstration complète
- [x] Route API de test
- [x] Gestion d'erreurs robuste
- [x] Validation des clés publiques
- [x] Calcul automatique du score de santé
- [x] Interface responsive avec Tailwind CSS

### 🚀 Fonctionnalités disponibles

1. **Analyse complète de nœuds Lightning**
   - Métriques SparkSeer en temps réel
   - Recommandations personnalisées OpenAI
   - Score de santé automatique

2. **Interface utilisateur moderne**
   - Composants réutilisables
   - Design responsive
   - Gestion d'état optimisée

3. **API robuste**
   - Authentification JWT transparente
   - Gestion d'erreurs standardisée
   - Validation des données

## 🔧 Maintenance

### Logs

L'API génère des logs détaillés :
- `🔄 Initialisation MCP-Light API...`
- `✅ MCP-Light API initialisée avec succès`
- `🔍 Analyse du nœud [pubkey]...`
- `✅ Analyse terminée avec succès`

### Monitoring

Utilisez la route `/api/mcp-light/test` pour surveiller l'état de l'API :
- État d'initialisation
- Santé de l'API
- Tests d'analyse

## 📚 Ressources

- [Documentation API MCP-Light](https://api.dazno.de/docs)
- [SparkSeer](https://sparkseer.space)
- [OpenAI](https://openai.com)

## 🐛 Dépannage

### Erreurs courantes

1. **API non initialisée**
   - Vérifiez la variable `NEXT_PUBLIC_DAZNO_API_URL`
   - Assurez-vous que `/auth/credentials` est dans l'OPTIONS Allowlist Vercel

2. **Pubkey invalide**
   - La clé publique doit faire exactement 66 caractères hexadécimaux
   - Utilisez `mcpLightAPI.isValidPubkey(pubkey)` pour valider

3. **Erreurs de réseau**
   - Vérifiez la connectivité à `https://api.dazno.de`
   - Consultez les logs de la console pour plus de détails

### Support

Pour toute question ou problème, consultez :
- Les logs de la console du navigateur
- La route `/api/mcp-light/test` pour les tests
- La documentation API officielle 
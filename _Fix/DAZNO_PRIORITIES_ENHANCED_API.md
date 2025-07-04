# Guide d'exploitation de l'API Priorities Enhanced

## Vue d'ensemble

L'endpoint `/api/dazno/priorities-enhanced/{pubkey}` est une version enrichie de l'API de priorités standard. Il combine les données de plusieurs sources (info du nœud, recommandations SparkSeer, et analyse OpenAI) pour fournir une analyse complète et des actions prioritaires détaillées.

## Endpoint

```
POST /api/dazno/priorities-enhanced/{pubkey}
```

### Paramètres d'URL

- `pubkey` (string, requis) : Clé publique du nœud Lightning (66 caractères hexadécimaux)

### Corps de la requête (JSON)

```json
{
  "context": "Optimisation complète du nœud Lightning",
  "goals": ["increase_revenue", "improve_centrality", "optimize_channels"],
  "includeHistorical": false,
  "depth": "standard",
  "logActivity": true
}
```

### Paramètres du corps

- `context` (string, optionnel) : Description du contexte ou objectif de l'utilisateur
- `goals` (array, optionnel) : Objectifs spécifiques pour l'analyse
  - Valeurs possibles : `increase_revenue`, `improve_centrality`, `optimize_channels`, `reduce_costs`, `improve_reliability`
- `includeHistorical` (boolean, optionnel) : Inclure les données historiques
- `depth` (string, optionnel) : Niveau de détail de l'analyse (`standard` ou `detailed`)
- `logActivity` (boolean, optionnel) : Enregistrer l'activité dans la base de données

## Format de réponse

```typescript
interface EnhancedPriorityResponse {
  pubkey: string
  timestamp: string
  node_summary: {
    alias: string
    capacity_btc: string
    channel_count: number
    centrality_rank: string
    health_score: number
    routing_performance?: {
      success_rate: number
      total_forwarded_7d: number
      revenue_7d: number
    }
  }
  priority_actions: EnhancedPriorityAction[]
  ai_analysis: {
    summary: string
    key_insights: string[]
    risk_assessment: string
    opportunity_score: number
  }
  context: string
  goals: string[]
  action_plan: {
    immediate_actions: string[]
    short_term_goals: string[]
    long_term_vision: string
  }
}

interface EnhancedPriorityAction {
  priority: number
  action: string
  timeline: string
  expected_impact: string
  difficulty: 'low' | 'medium' | 'high'
  category?: string
  urgency?: 'low' | 'medium' | 'high'
  cost_estimate?: number
  implementation_details?: {
    steps: string[]
    requirements: string[]
    estimated_hours?: number
    tools_needed?: string[]
  }
  related_recommendations?: any[]
  metrics_to_track?: string[]
  success_criteria?: string[]
}
```

## Exemples d'utilisation

### 1. Appel direct avec cURL

```bash
curl -X POST https://daznode.com/api/dazno/priorities-enhanced/02a8d7d8e3b4c5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "context": "Je veux optimiser mes revenus de routage",
    "goals": ["increase_revenue", "optimize_channels"],
    "logActivity": true
  }'
```

### 2. Utilisation avec JavaScript/TypeScript

```typescript
async function analyzePriorities(pubkey: string) {
  try {
    const response = await fetch(`/api/dazno/priorities-enhanced/${pubkey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        context: "Optimisation pour maximiser les revenus et améliorer la centralité",
        goals: ["increase_revenue", "improve_centrality"],
        depth: "detailed",
        logActivity: true
      })
    })

    if (!response.ok) {
      throw new Error('Erreur lors de l\'analyse')
    }

    const result = await response.json()
    
    if (result.success) {
      console.log('Analyse complétée:', result.data)
      
      // Afficher le résumé
      console.log('Score de santé:', result.data.node_summary.health_score)
      console.log('Score d\'opportunité:', result.data.ai_analysis.opportunity_score)
      
      // Afficher les actions immédiates
      console.log('Actions immédiates:')
      result.data.action_plan.immediate_actions.forEach(action => {
        console.log(`- ${action}`)
      })
      
      // Traiter les actions prioritaires
      result.data.priority_actions.forEach(action => {
        console.log(`\nAction: ${action.action}`)
        console.log(`Priorité: ${action.priority}`)
        console.log(`Difficulté: ${action.difficulty}`)
        console.log(`Impact attendu: ${action.expected_impact}`)
        
        if (action.implementation_details) {
          console.log('Étapes d\'implémentation:')
          action.implementation_details.steps.forEach(step => {
            console.log(`  - ${step}`)
          })
        }
      })
    }
  } catch (error) {
    console.error('Erreur:', error)
  }
}
```

### 3. Utilisation avec le hook React personnalisé

```tsx
import { usePrioritiesEnhanced } from '@/hooks/usePrioritiesEnhanced'

function NodeAnalysisComponent({ pubkey }: { pubkey: string }) {
  const { data, loading, error, fetchPriorities } = usePrioritiesEnhanced()

  useEffect(() => {
    fetchPriorities(pubkey, {
      context: "Je veux optimiser mon nœud pour devenir un hub majeur",
      goals: ["improve_centrality", "increase_revenue", "optimize_channels"],
      depth: "detailed",
      logActivity: true
    })
  }, [pubkey])

  if (loading) return <div>Analyse en cours...</div>
  if (error) return <div>Erreur: {error.message}</div>
  if (!data) return null

  return (
    <div>
      <h2>Analyse du Nœud {data.node_summary.alias}</h2>
      
      <div>
        <h3>Scores</h3>
        <p>Santé: {data.node_summary.health_score}/100</p>
        <p>Opportunité: {data.ai_analysis.opportunity_score}/100</p>
      </div>

      <div>
        <h3>Actions Prioritaires</h3>
        {data.priority_actions.map((action, index) => (
          <div key={index}>
            <h4>{action.action}</h4>
            <p>Difficulté: {action.difficulty}</p>
            <p>Timeline: {action.timeline}</p>
            <p>Impact: {action.expected_impact}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 4. Intégration dans une page complète

```tsx
import { PrioritiesEnhancedPanel } from '@/components/dazno/PrioritiesEnhancedPanel'

export default function NodeDashboard() {
  const [pubkey, setPubkey] = useState('your-node-pubkey')
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord du Nœud</h1>
      
      <PrioritiesEnhancedPanel 
        pubkey={pubkey} 
        className="max-w-6xl mx-auto"
      />
    </div>
  )
}
```

## Cas d'usage

### 1. Optimisation des revenus

```javascript
const revenueOptimization = {
  context: "Je veux maximiser mes revenus de routage sur les 3 prochains mois",
  goals: ["increase_revenue", "optimize_channels"],
  depth: "detailed"
}
```

### 2. Amélioration de la centralité

```javascript
const centralityImprovement = {
  context: "Je veux devenir un hub central dans le réseau Lightning",
  goals: ["improve_centrality", "increase_revenue"],
  depth: "detailed"
}
```

### 3. Réduction des coûts

```javascript
const costReduction = {
  context: "Je veux réduire mes coûts d'opération tout en maintenant la performance",
  goals: ["reduce_costs", "improve_reliability"],
  depth: "standard"
}
```

## Différences avec l'API standard

### API Standard (`/api/dazno/priorities/{pubkey}`)
- Retourne uniquement les actions prioritaires basiques
- Analyse OpenAI simple
- Pas de détails d'implémentation
- Pas de métriques de suivi

### API Enhanced (`/api/dazno/priorities-enhanced/{pubkey}`)
- Combine les données de 3 sources (NodeInfo, Recommendations, Priorities)
- Fournit des détails d'implémentation pour chaque action
- Inclut des métriques de suivi et critères de succès
- Calcule des scores de santé et d'opportunité
- Génère un plan d'action structuré (immédiat, court terme, long terme)
- Analyse AI enrichie avec insights et évaluation des risques

## Gestion des erreurs

L'API retourne des erreurs standardisées :

```json
{
  "success": false,
  "error": {
    "code": "INVALID_PUBKEY",
    "message": "Clé publique invalide: doit être 66 caractères hexadécimaux"
  }
}
```

Codes d'erreur possibles :
- `INVALID_PUBKEY` : Clé publique invalide
- `UNAUTHORIZED` : Authentification requise
- `EXTERNAL_API_ERROR` : Erreur lors de l'appel aux APIs externes
- `RATE_LIMIT_EXCEEDED` : Limite de taux dépassée

## Bonnes pratiques

1. **Cache les résultats** : Les analyses sont coûteuses, implémentez un cache côté client
2. **Gestion d'erreur robuste** : Toujours gérer les cas d'erreur
3. **Limiter les appels** : Évitez les appels répétitifs, utilisez le bouton "Actualiser"
4. **Contexte précis** : Plus le contexte est précis, meilleures sont les recommandations
5. **Objectifs alignés** : Choisissez des objectifs cohérents entre eux

## Performance

- Temps de réponse moyen : 2-5 secondes (dépend de la charge)
- Les 3 appels API sont effectués en parallèle pour optimiser les performances
- Le calcul des scores et enrichissements est fait côté serveur

## Sécurité

- Authentification requise via JWT
- Validation stricte de la clé publique
- Protection contre les injections
- Rate limiting pour éviter les abus
- Logging optionnel des activités

## Évolutions futures

- Support des analyses historiques
- Comparaison avec des nœuds similaires
- Suggestions de partenaires pour les canaux
- Intégration avec des outils d'automatisation
- Export des plans d'action en PDF
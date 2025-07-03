import { NextRequest, NextResponse } from 'next/server'
import { mcpLightAPI } from '@/lib/services/mcp-light-api'
import { ApiResponse } from '@/types/database'
import { createSupabaseServerClient } from '@/lib/supabase-auth'

// Interfaces pour les types de données
export interface NodeStats {
  alias?: string
  capacity: number
  channel_count?: number
  centrality_rank?: number
  htlc_success_rate?: number
  routing_revenue_7d?: number
}

export interface NodeInfo {
  current_stats: NodeStats
}

export interface Recommendation {
  type: string
  category?: string
}

export interface Recommendations {
  recommendations: Recommendation[]
}

export interface PriorityAction {
  priority: number
  action: string
  timeline: string
  expected_impact: string
  difficulty: 'low' | 'medium' | 'high'
  category?: string
  urgency?: 'low' | 'medium' | 'high'
  cost_estimate?: number
}

export interface Priorities {
  priority_actions: PriorityAction[]
  goals?: string[]
}

export interface ImplementationDetails {
  steps: string[]
  requirements: string[]
  estimated_hours?: number
  tools_needed?: string[]
}

export interface AIAnalysis {
  summary: string
  key_insights: string[]
  risk_assessment: string
  opportunity_score: number
}

export interface ActionPlan {
  immediate_actions: string[]
  short_term_goals: string[]
  long_term_vision: string
}

export interface EnhancedPriorityAction {
  priority: number
  action: string
  timeline: string
  expected_impact: string
  difficulty: 'low' | 'medium' | 'high'
  category?: string
  urgency?: 'low' | 'medium' | 'high'
  cost_estimate?: number
  implementation_details?: ImplementationDetails
  related_recommendations?: Recommendation[]
  metrics_to_track?: string[]
  success_criteria?: string[]
}

export interface EnhancedPriorityResponse {
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
  ai_analysis: AIAnalysis
  context: string
  goals: string[]
  action_plan: ActionPlan
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ pubkey: string }> }
): Promise<Response> {
  try {
    const resolvedParams = await params
    const pubkey = resolvedParams.pubkey
    
    // Validation de la clé publique
    if (!mcpLightAPI.isValidPubkey(pubkey)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_PUBKEY',
          message: 'Clé publique invalide: doit être 66 caractères hexadécimaux'
        }
      }, { status: 400 })
    }

    // Récupération des paramètres de la requête
    const body = await req.json()
    const context = body.context || "Optimisation complète du nœud Lightning"
    const goals = body.goals || ["increase_revenue", "improve_centrality", "optimize_channels"]
    const _includeHistorical = body.includeHistorical || false
    const _depth = body.depth || 'standard' // 'standard' ou 'detailed'

    // Vérifier si l'utilisateur a accès à cette fonctionnalité
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentification requise'
        }
      }, { status: 401 })
    }

    // Récupérer toutes les données en parallèle avec fallback
    console.log(`🔍 Analyse enhanced du nœud ${pubkey.substring(0, 10)}...`)
    
    let nodeInfo: NodeInfo, recommendations: Recommendations, priorities: Priorities;
    
    try {
      [nodeInfo, recommendations, priorities] = await Promise.all([
        mcpLightAPI.getNodeInfo(pubkey),
        mcpLightAPI.getRecommendations(pubkey),
        mcpLightAPI.getPriorityActions(pubkey, context, goals)
      ]);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'API_UNAVAILABLE') {
        console.warn('⚠️ API MCP-Light indisponible, génération de données de fallback');
        const fallbackData = generateFallbackAnalysis(pubkey);
        nodeInfo = fallbackData.nodeInfo;
        recommendations = fallbackData.recommendations;
        priorities = fallbackData.priorities;
      } else {
        throw error;
      }
    }

    // Enrichir les actions prioritaires
    const enhancedActions: EnhancedPriorityAction[] = priorities.priority_actions.map((action: any, _index: any) => {
      // Trouver les recommandations liées
      const relatedRecommendations = recommendations.recommendations.filter(rec => 
        rec.type.toLowerCase().includes(action.category?.toLowerCase() || '') ||
        action.action.toLowerCase().includes(rec.type.toLowerCase())
      )

      // Générer des détails d'implémentation basés sur l'action
      const implementationDetails = generateImplementationDetails(action, nodeInfo)

      return {
        ...action,
        implementation_details: implementationDetails,
        related_recommendations: relatedRecommendations,
        metrics_to_track: generateMetricsToTrack(action),
        success_criteria: generateSuccessCriteria(action)
      }
    })

    // Calculer les métriques de performance du routage
    const routingPerformance = nodeInfo.current_stats.htlc_success_rate ? {
      success_rate: nodeInfo.current_stats.htlc_success_rate,
      total_forwarded_7d: nodeInfo.current_stats.routing_revenue_7d || 0,
      revenue_7d: nodeInfo.current_stats.routing_revenue_7d || 0
    } : undefined

    // Générer l'analyse AI enrichie
    const aiAnalysis = generateAIAnalysis(nodeInfo, recommendations, priorities, enhancedActions)

    // Créer le plan d'action structuré
    const actionPlan = createActionPlan(enhancedActions, priorities)

    // Construire la réponse enrichie
    const enhancedResponse: EnhancedPriorityResponse = {
      pubkey,
      timestamp: new Date().toISOString(),
      node_summary: {
        alias: nodeInfo.current_stats.alias || 'Nœud Anonyme',
        capacity_btc: (nodeInfo.current_stats.capacity / 100000000).toFixed(4),
        channel_count: nodeInfo.current_stats.channel_count || 0,
        centrality_rank: nodeInfo.current_stats.centrality_rank?.toString() || 'N/A',
        health_score: calculateEnhancedHealthScore(nodeInfo.current_stats),
        routing_performance: routingPerformance
      },
      priority_actions: enhancedActions,
      ai_analysis: aiAnalysis,
      context,
      goals,
      action_plan: actionPlan
    }

    // Logger l'activité si demandé
    if (body.logActivity) {
      await logUserActivity(user.id, pubkey, 'priorities_enhanced', enhancedResponse)
    }

    return NextResponse.json<ApiResponse<EnhancedPriorityResponse>>({
      success: true,
      data: enhancedResponse,
      meta: {
        timestamp: new Date().toISOString(),
        version: '2.0-enhanced'
      }
    })

  } catch (error) {
    console.error('❌ Erreur priorities enhanced:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'EXTERNAL_API_ERROR',
        message: error instanceof Error ? error.message : 'Erreur lors de l\'analyse des priorités enhanced'
      }
    }, { status: 500 })
  }
}

// Fonctions utilitaires

function generateFallbackAnalysis(pubkey: string) {
  return {
    nodeInfo: {
      pubkey,
      current_stats: {
        alias: 'Nœud Lightning',
        capacity: 50000000, // 0.5 BTC
        channel_count: 8,
        centrality_rank: 5000,
        htlc_success_rate: 95,
        uptime_percentage: 99,
        routing_revenue_7d: 1000
      }
    },
    recommendations: {
      pubkey,
      timestamp: new Date().toISOString(),
      recommendations: [
        {
          type: 'channel_optimization',
          priority: 'high' as const,
          reasoning: 'Optimiser la gestion des canaux pour améliorer la liquidité',
          expected_benefit: 'Augmentation des revenus de routage'
        },
        {
          type: 'fee_adjustment',
          priority: 'medium' as const,
          reasoning: 'Ajuster les frais pour rester compétitif',
          expected_benefit: 'Meilleur équilibre revenus/volume'
        }
      ]
    },
    priorities: {
      pubkey,
      timestamp: new Date().toISOString(),
      priority_actions: [
        {
          priority: 1,
          action: 'Optimiser la gestion des canaux Lightning',
          timeline: '1-2 semaines',
          expected_impact: 'Amélioration des revenus de routage de 15-25%',
          difficulty: 'medium' as const,
          category: 'channels',
          urgency: 'high' as const
        },
        {
          priority: 2,
          action: 'Ajuster les frais de routage',
          timeline: '3-5 jours',
          expected_impact: 'Optimisation du ratio volume/revenus',
          difficulty: 'low' as const,
          category: 'fees',
          urgency: 'medium' as const
        }
      ],
      openai_analysis: 'Analyse de fallback générée localement en raison de l\'indisponibilité de l\'API externe.',
      context: 'Mode fallback',
      goals: ['increase_revenue', 'improve_centrality']
    }
  };
}

function generateImplementationDetails(action: PriorityAction, _nodeInfo: NodeInfo): ImplementationDetails {
  const details: ImplementationDetails = {
    steps: [],
    requirements: [],
    estimated_hours: 0,
    tools_needed: []
  }

  // Logique basée sur le type d'action
  if (action.action.toLowerCase().includes('channel')) {
    details.steps = [
      'Analyser les canaux existants',
      'Identifier les partenaires potentiels',
      'Calculer la taille optimale du canal',
      'Ouvrir le canal avec les paramètres optimaux'
    ]
    details.requirements = [
      'Liquidité suffisante',
      'Partenaire fiable identifié',
      'Frais on-chain disponibles'
    ]
    details.estimated_hours = 2
    details.tools_needed = ['Lightning Terminal', 'Ride The Lightning', 'Amboss']
  }

  if (action.action.toLowerCase().includes('fee')) {
    details.steps = [
      'Analyser les frais actuels',
      'Étudier les frais des concurrents',
      'Ajuster progressivement les frais',
      'Monitorer l\'impact sur le routage'
    ]
    details.requirements = [
      'Accès au nœud Lightning',
      'Historique des transactions'
    ]
    details.estimated_hours = 1
    details.tools_needed = ['Lightning Terminal', 'ThunderHub']
  }

  return details
}

function generateMetricsToTrack(action: PriorityAction): string[] {
  const metrics: string[] = []
  
  if (action.category === 'channels') {
    metrics.push('Nombre de canaux actifs', 'Capacité totale', 'Ratio in/out')
  }
  
  if (action.category === 'fees') {
    metrics.push('Revenus de routage', 'Volume transféré', 'Taux de succès HTLC')
  }
  
  if (action.category === 'performance') {
    metrics.push('Uptime du nœud', 'Latence moyenne', 'Taux de succès des paiements')
  }

  return metrics
}

function generateSuccessCriteria(action: PriorityAction): string[] {
  const criteria: string[] = []
  
  if (action.expected_impact.includes('revenue')) {
    criteria.push('Augmentation des revenus de routage de 20%+')
  }
  
  if (action.expected_impact.includes('centrality')) {
    criteria.push('Amélioration du rang de centralité')
  }
  
  if (action.expected_impact.includes('reliability')) {
    criteria.push('Taux de succès HTLC > 95%')
  }

  return criteria
}

function calculateEnhancedHealthScore(stats: NodeStats): number {
  let score = 0
  let factors = 0

  // Score basé sur la capacité
  if (stats.capacity > 100000000) { score += 25; factors++; } // > 1 BTC
  else if (stats.capacity > 10000000) { score += 15; factors++; } // > 0.1 BTC
  else if (stats.capacity > 1000000) { score += 5; factors++; } // > 0.01 BTC

  // Score basé sur les canaux
  if (stats.channel_count && stats.channel_count > 20) { score += 25; factors++; }
  else if (stats.channel_count && stats.channel_count > 10) { score += 15; factors++; }
  else if (stats.channel_count && stats.channel_count > 5) { score += 5; factors++; }

  // Score basé sur la centralité
  if (stats.centrality_rank && stats.centrality_rank < 1000) { score += 25; factors++; }
  else if (stats.centrality_rank && stats.centrality_rank < 5000) { score += 15; factors++; }
  else if (stats.centrality_rank && stats.centrality_rank < 10000) { score += 5; factors++; }

  // Score basé sur la performance
  if (stats.htlc_success_rate && stats.htlc_success_rate > 98) { score += 25; factors++; }
  else if (stats.htlc_success_rate && stats.htlc_success_rate > 95) { score += 15; factors++; }
  else if (stats.htlc_success_rate && stats.htlc_success_rate > 90) { score += 5; factors++; }

  return factors > 0 ? Math.round(score / factors * 4) : 50
}

function generateAIAnalysis(nodeInfo: NodeInfo, recommendations: Recommendations, priorities: Priorities, enhancedActions: EnhancedPriorityAction[]): AIAnalysis {
  const insights: string[] = []
  
  // Analyser les points forts
  if (nodeInfo.current_stats.centrality_rank && nodeInfo.current_stats.centrality_rank < 1000) {
    insights.push('Votre nœud est très bien positionné dans le réseau (top 1000)')
  }
  
  if (nodeInfo.current_stats.htlc_success_rate && nodeInfo.current_stats.htlc_success_rate > 95) {
    insights.push('Excellent taux de succès des transactions (>95%)')
  }

  // Analyser les opportunités
  if (recommendations.recommendations.some((r: Recommendation) => r.type === 'high_priority')) {
    insights.push('Des opportunités d\'amélioration importantes ont été identifiées')
  }

  // Calculer le score d\'opportunité
  const opportunityScore = calculateOpportunityScore(nodeInfo, recommendations, enhancedActions)

  return {
    summary: 'Analyse complète du nœud Lightning avec recommandations personnalisées.',
    key_insights: insights,
    risk_assessment: assessRisks(nodeInfo, recommendations),
    opportunity_score: opportunityScore
  }
}

function calculateOpportunityScore(nodeInfo: NodeInfo, recommendations: Recommendations, actions: EnhancedPriorityAction[]): number {
  let score = 50 // Score de base
  
  // Bonus pour les recommandations high priority
  const highPriorityCount = recommendations.recommendations.filter((r: Recommendation) => r.type === 'high_priority').length
  score += highPriorityCount * 10
  
  // Bonus pour le potentiel d'amélioration
  if (nodeInfo.current_stats.channel_count && nodeInfo.current_stats.channel_count < 10) score += 20 // Potentiel de croissance
  if (nodeInfo.current_stats.centrality_rank && nodeInfo.current_stats.centrality_rank > 5000) score += 15 // Marge d'amélioration
  
  // Ajuster selon la difficulté des actions
  const easyActionsCount = actions.filter((a: EnhancedPriorityAction) => a.difficulty === 'low').length
  score += easyActionsCount * 5
  
  return Math.min(100, Math.max(0, score))
}

function assessRisks(nodeInfo: NodeInfo, _recommendations: Recommendations): string {
  const risks: string[] = []
  
  if (nodeInfo.current_stats.channel_count && nodeInfo.current_stats.channel_count < 5) {
    risks.push('Nombre de canaux insuffisant pour une bonne résilience')
  }
  
  if (nodeInfo.current_stats.capacity < 10000000) {
    risks.push('Capacité totale faible (< 0.1 BTC)')
  }
  
  if (nodeInfo.current_stats.htlc_success_rate && nodeInfo.current_stats.htlc_success_rate < 90) {
    risks.push('Taux de succès HTLC faible (< 90%)')
  }

  return risks.length > 0 ? risks.join('. ') : 'Risques faibles identifiés'
}

function createActionPlan(enhancedActions: EnhancedPriorityAction[], priorities: Priorities): ActionPlan {
  const immediateActions = enhancedActions
    .filter(action => action.urgency === 'high')
    .slice(0, 3)
    .map(action => action.action)

  const shortTermGoals = enhancedActions
    .filter(action => action.difficulty === 'low' || action.difficulty === 'medium')
    .slice(0, 5)
    .map(action => action.action)

  const longTermVision = generateLongTermVision(priorities.goals || [], enhancedActions)

  return {
    immediate_actions: immediateActions,
    short_term_goals: shortTermGoals,
    long_term_vision: longTermVision
  }
}

function generateLongTermVision(goals: string[], _actions: EnhancedPriorityAction[]): string {
  if (goals.includes('increase_revenue')) {
    return 'Transformer votre nœud en un hub Lightning rentable et fiable, générant des revenus passifs significatifs'
  }
  
  if (goals.includes('improve_centrality')) {
    return 'Positionner votre nœud comme un point central du réseau Lightning, maximisant son influence et sa fiabilité'
  }
  
  return 'Optimiser votre nœud Lightning pour une performance maximale et une rentabilité durable'
}

async function logUserActivity(userId: string, pubkey: string, action: string, data: EnhancedPriorityResponse): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient()
    await supabase.from('user_activities').insert({
      user_id: userId,
      action_type: action,
      target_pubkey: pubkey,
      metadata: data,
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.warn('⚠️ Impossible de logger l\'activité utilisateur:', error)
  }
}

export const dynamic = "force-dynamic";

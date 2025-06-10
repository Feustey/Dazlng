import { NextRequest, NextResponse } from 'next/server'
import { mcpLightAPI } from '@/lib/services/mcp-light-api'
import { ApiResponse } from '@/types/database'
import { createClient } from '@/utils/supabase/server'

export interface EnhancedPriorityAction {
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
    const includeHistorical = body.includeHistorical || false
    const depth = body.depth || 'standard' // 'standard' ou 'detailed'

    // Vérifier si l'utilisateur a accès à cette fonctionnalité
    const supabase = await createClient()
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

    // Récupérer toutes les données en parallèle pour optimiser les performances
    console.log(`🔍 Analyse enhanced du nœud ${pubkey.substring(0, 10)}...`)
    
    const [nodeInfo, recommendations, priorities] = await Promise.all([
      mcpLightAPI.getNodeInfo(pubkey),
      mcpLightAPI.getRecommendations(pubkey),
      mcpLightAPI.getPriorityActions(pubkey, context, goals)
    ])

    // Enrichir les actions prioritaires
    const enhancedActions: EnhancedPriorityAction[] = priorities.priority_actions.map((action, index) => {
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

function generateImplementationDetails(action: any, nodeInfo: any) {
  const details: any = {
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

function generateMetricsToTrack(action: any): string[] {
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

function generateSuccessCriteria(action: any): string[] {
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

function calculateEnhancedHealthScore(stats: any): number {
  let score = 0
  let factors = 0

  // Score basé sur la capacité
  if (stats.capacity > 100000000) { score += 25; factors++; } // > 1 BTC
  else if (stats.capacity > 10000000) { score += 15; factors++; } // > 0.1 BTC
  else if (stats.capacity > 1000000) { score += 5; factors++; } // > 0.01 BTC

  // Score basé sur les canaux
  if (stats.channel_count > 20) { score += 25; factors++; }
  else if (stats.channel_count > 10) { score += 15; factors++; }
  else if (stats.channel_count > 5) { score += 5; factors++; }

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

function generateAIAnalysis(nodeInfo: any, recommendations: any, priorities: any, enhancedActions: any) {
  const insights: string[] = []
  
  // Analyser les points forts
  if (nodeInfo.current_stats.centrality_rank < 1000) {
    insights.push('Votre nœud est très bien positionné dans le réseau (top 1000)')
  }
  
  if (nodeInfo.current_stats.htlc_success_rate > 95) {
    insights.push('Excellent taux de succès des transactions (>95%)')
  }

  // Analyser les opportunités
  if (recommendations.recommendations.some((r: any) => r.priority === 'high')) {
    insights.push('Des opportunités d\'amélioration importantes ont été identifiées')
  }

  // Calculer le score d\'opportunité
  const opportunityScore = calculateOpportunityScore(nodeInfo, recommendations, enhancedActions)

  return {
    summary: priorities.openai_analysis || 'Analyse complète du nœud Lightning avec recommandations personnalisées.',
    key_insights: insights,
    risk_assessment: assessRisks(nodeInfo, recommendations),
    opportunity_score: opportunityScore
  }
}

function calculateOpportunityScore(nodeInfo: any, recommendations: any, actions: any): number {
  let score = 50 // Score de base
  
  // Bonus pour les recommandations high priority
  const highPriorityCount = recommendations.recommendations.filter((r: any) => r.priority === 'high').length
  score += highPriorityCount * 10
  
  // Bonus pour le potentiel d'amélioration
  if (nodeInfo.current_stats.channel_count < 10) score += 20 // Potentiel de croissance
  if (nodeInfo.current_stats.centrality_rank > 5000) score += 15 // Marge d'amélioration
  
  // Ajuster selon la difficulté des actions
  const easyActionsCount = actions.filter((a: any) => a.difficulty === 'low').length
  score += easyActionsCount * 5
  
  return Math.min(100, Math.max(0, score))
}

function assessRisks(nodeInfo: any, recommendations: any): string {
  const risks: string[] = []
  
  if (nodeInfo.current_stats.channel_count < 5) {
    risks.push('Nombre de canaux insuffisant pour une bonne résilience')
  }
  
  if (nodeInfo.current_stats.htlc_success_rate < 90) {
    risks.push('Taux de succès des transactions nécessite une amélioration')
  }
  
  if (recommendations.recommendations.some((r: any) => r.type === 'close_channel')) {
    risks.push('Certains canaux sous-performants identifiés')
  }

  return risks.length > 0 
    ? `Risques identifiés: ${risks.join(', ')}`
    : 'Aucun risque majeur identifié. Le nœud est en bonne santé.'
}

function createActionPlan(enhancedActions: any[], priorities: any) {
  // Actions immédiates (haute priorité et faciles)
  const immediateActions = enhancedActions
    .filter(a => a.urgency === 'high' || (a.priority <= 2 && a.difficulty === 'low'))
    .slice(0, 3)
    .map(a => a.action)

  // Objectifs court terme (1-4 semaines)
  const shortTermGoals = enhancedActions
    .filter(a => a.timeline.includes('week') || a.timeline.includes('semaine'))
    .slice(0, 5)
    .map(a => `${a.action} (${a.timeline})`)

  // Vision long terme
  const longTermVision = generateLongTermVision(priorities.goals, enhancedActions)

  return {
    immediate_actions: immediateActions,
    short_term_goals: shortTermGoals,
    long_term_vision: longTermVision
  }
}

function generateLongTermVision(goals: string[], actions: any[]): string {
  const visionParts: string[] = []
  
  if (goals.includes('increase_revenue')) {
    visionParts.push('maximiser les revenus de routage')
  }
  
  if (goals.includes('improve_centrality')) {
    visionParts.push('devenir un hub central du réseau Lightning')
  }
  
  if (goals.includes('optimize_channels')) {
    visionParts.push('maintenir un réseau de canaux optimal et équilibré')
  }

  return visionParts.length > 0
    ? `Vision à 6 mois: ${visionParts.join(', ')}.`
    : 'Consolider la position du nœud et optimiser les performances globales.'
}

async function logUserActivity(userId: string, pubkey: string, action: string, data: any) {
  try {
    const supabase = await createClient()
    
    await supabase.from('user_activities').insert({
      user_id: userId,
      action: action,
      resource_type: 'node_analysis',
      resource_id: pubkey,
      metadata: {
        goals: data.goals,
        context: data.context,
        priority_count: data.priority_actions.length,
        health_score: data.node_summary.health_score
      }
    })
  } catch (error) {
    console.error('Erreur lors du logging de l\'activité:', error)
  }
}

// Export pour les tests
export type { EnhancedPriorityAction, EnhancedPriorityResponse }
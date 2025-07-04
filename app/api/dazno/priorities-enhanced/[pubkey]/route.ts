import { NextRequest, NextResponse } from "next/server"
import { mcpLightAPI } from "@/lib/services/mcp-light-api"
import { ApiResponse } from "@/types/database"
import { createSupabaseServerClient } from "@/lib/supabase-auth"

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
  difficulty: "low" | "medium" | "high"
  category?: string
  urgency?: "low" | "medium" | "high"
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
  difficulty: "low" | "medium" | "high"
  category?: string
  urgency?: "low" | "medium" | "high"
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
      return NextResponse.json<ApiResponse<any>>({
        success: false,
        error: {
          code: "INVALID_PUBKEY",
          message: "Clé publique invalide: doit être 66 caractères hexadécimaux"
        }
      }, { status: 400 })
    }

    // Récupération des paramètres de la requête
    const body = await req.json()
    const context = body.context || "Optimisation complète du nœud Lightning"
    const goals = body.goals || ["increase_revenue", "improve_centrality", "optimize_channels"]
    const _includeHistorical = body.includeHistorical || false
    const _depth = body.depth || "standard" // "standard" ou "detailed"

    // Vérifier si l'utilisateur a accès à cette fonctionnalité
    const supabase = await createSupabaseServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json<ApiResponse<any>>({
        success: false,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentification requise"
        }
      }, { status: 401 })
    }

    // Récupérer toutes les données en parallèle avec fallback
    console.log(`🔍 Analyse enhanced du nœud ${pubkey.substring(0, 10)}...`)
    
    let nodeInfo: NodeInfo, recommendations: Recommendations, priorities: Priorities
    
    try {
      [nodeInfo, recommendations, priorities] = await Promise.all([
        mcpLightAPI.getNodeInfo(pubkey),
        mcpLightAPI.getRecommendations(pubkey),
        mcpLightAPI.getPriorityActions(pubkey, context, goals)
      ])
    } catch (error: unknown) {
      if (error instanceof Error && error.message === "API_UNAVAILABLE") {
        console.warn("⚠️ API MCP-Light indisponible, génération de données de fallback")
        const fallbackData = generateFallbackAnalysis(pubkey)
        nodeInfo = fallbackData.nodeInfo
        recommendations = fallbackData.recommendations
        priorities = fallbackData.priorities
      } else {
        throw error
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
        alias: nodeInfo.current_stats.alias || "Nœud Lightning",
        capacity_btc: (nodeInfo.current_stats.capacity / 100000000).toFixed(8),
        channel_count: nodeInfo.current_stats.channel_count || 0,
        centrality_rank: nodeInfo.current_stats.centrality_rank?.toString() || "N/A",
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
      await logUserActivity(user.id, pubkey, "priorities_enhanced", enhancedResponse)
    }

    return NextResponse.json<ApiResponse<EnhancedPriorityResponse>>({
      success: true,
      data: enhancedResponse,
      meta: {
        timestamp: new Date().toISOString(),
        version: "2.0-enhanced"
      }
    })

  } catch (error) {
    console.error("❌ Erreur priorities enhanced:", error)
    return NextResponse.json<ApiResponse<any>>({
      success: false,
      error: {
        code: "EXTERNAL_API_ERROR",
        message: error instanceof Error ? error.message : "Erreur lors de l'analyse des priorités enhanced"
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
        alias: "Nœud de Fallback",
        capacity: 1000000000,
        channel_count: 10,
        centrality_rank: 5000,
        htlc_success_rate: 0.95,
        routing_revenue_7d: 50000
      }
    },
    recommendations: {
      recommendations: [
        { type: "channel_optimization", category: "performance" },
        { type: "fee_adjustment", category: "revenue" }
      ]
    },
    priorities: {
      priority_actions: [
        {
          priority: 1,
          action: "Optimiser les frais de routage",
          timeline: "1-2 semaines",
          expected_impact: "Augmentation de 20% des revenus",
          difficulty: "medium" as const,
          category: "revenue",
          urgency: "high" as const
        }
      ]
    }
  }
}

function generateImplementationDetails(action: PriorityAction, nodeInfo: NodeInfo): ImplementationDetails {
  return {
    steps: [
      "Analyser les métriques actuelles",
      "Identifier les opportunités d'amélioration",
      "Implémenter les changements progressivement",
      "Monitorer les résultats"
    ],
    requirements: [
      "Accès aux données du nœud",
      "Outils de monitoring",
      "Connaissance du réseau Lightning"
    ],
    estimated_hours: 8,
    tools_needed: ["Lightning Terminal", "Amboss", "1ML"]
  }
}

function generateMetricsToTrack(action: PriorityAction): string[] {
  return [
    "Revenus de routage",
    "Taux de succès HTLC",
    "Nombre de canaux",
    "Centralité du nœud"
  ]
}

function generateSuccessCriteria(action: PriorityAction): string[] {
  return [
    "Augmentation des revenus de 10%",
    "Amélioration du taux de succès",
    "Meilleure position dans le réseau"
  ]
}

function calculateEnhancedHealthScore(stats: NodeStats): number {
  let score = 50 // Score de base

  // Facteurs de santé
  if (stats.htlc_success_rate) {
    score += stats.htlc_success_rate * 20
  }
  
  if (stats.channel_count && stats.channel_count > 10) {
    score += 10
  }
  
  if (stats.capacity && stats.capacity > 1000000000) {
    score += 10
  }
  
  if (stats.centrality_rank && stats.centrality_rank < 1000) {
    score += 10
  }

  return Math.min(score, 100)
}

function generateAIAnalysis(
  nodeInfo: NodeInfo, 
  recommendations: Recommendations, 
  priorities: Priorities, 
  enhancedActions: EnhancedPriorityAction[]
): AIAnalysis {
  const opportunityScore = calculateOpportunityScore(nodeInfo, recommendations, enhancedActions)
  
  return {
    summary: "Analyse complète du nœud Lightning avec recommandations optimisées",
    key_insights: [
      "Optimisation des frais recommandée",
      "Amélioration de la connectivité nécessaire",
      "Monitoring continu essentiel"
    ],
    risk_assessment: "Risque modéré avec potentiel élevé",
    opportunity_score: opportunityScore
  }
}

function calculateOpportunityScore(
  nodeInfo: NodeInfo, 
  recommendations: Recommendations, 
  actions: EnhancedPriorityAction[]
): number {
  let score = 0
  
  // Score basé sur les recommandations
  score += recommendations.recommendations.length * 10
  
  // Score basé sur les actions prioritaires
  score += actions.length * 15
  
  // Score basé sur la santé du nœud
  const healthScore = calculateEnhancedHealthScore(nodeInfo.current_stats)
  score += (100 - healthScore) * 0.3 // Plus le nœud est en mauvaise santé, plus il y a d'opportunités
  
  return Math.min(score, 100)
}

function createActionPlan(enhancedActions: EnhancedPriorityAction[], priorities: Priorities): ActionPlan {
  return {
    immediate_actions: enhancedActions
      .filter(action => action.urgency === "high")
      .map(action => action.action),
    short_term_goals: [
      "Optimiser la configuration du nœud",
      "Améliorer la connectivité",
      "Augmenter les revenus de routage"
    ],
    long_term_vision: "Devenir un nœud Lightning de référence avec une excellente performance et rentabilité"
  }
}

async function logUserActivity(
  userId: string, 
  pubkey: string, 
  action: string, 
  data: EnhancedPriorityResponse
): Promise<void> {
  try {
    const supabase = await createSupabaseServerClient()
    await supabase.from('user_activities').insert({
      user_id: userId,
      action,
      metadata: { pubkey, data },
      created_at: new Date().toISOString()
    })
  } catch (error) {
    console.error("Erreur lors du logging de l'activité:", error)
  }
}

export const dynamic = "force-dynamic";
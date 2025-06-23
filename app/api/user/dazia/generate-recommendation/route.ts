import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase-auth'
import { getSupabaseAdminClient } from '@/lib/supabase'
import { mcpLightAPI } from '@/lib/services/mcp-light-api'
import { ApiResponse } from '@/types/database'

interface _DailyRecommendation {
  id: string
  user_id: string
  pubkey: string
  generated_at: string
  recommendation_data: any
  expires_at: string
}

interface GeneratedRecommendation {
  id: string
  title: string
  description: string
  category: string
  priority: number
  impact: 'low' | 'medium' | 'high'
  difficulty: 'easy' | 'medium' | 'hard'
  estimated_time: string
  implementation_steps: string[]
  success_criteria: string[]
  generated_at: string
  expires_at: string
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // 1. Authentification
    const supabase = await createSupabaseServerClient()
    
    const authHeader = request.headers.get('authorization');
    let user = null;
    
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user: tokenUser }, error } = await supabase.auth.getUser(token);
      
      if (error || !tokenUser) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Token invalide'
          }
        }, { status: 401 })
      }
      user = tokenUser;
    } else {
      const { data: { user: sessionUser }, error } = await supabase.auth.getUser()
      
      if (error || !sessionUser) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentification requise'
          }
        }, { status: 401 })
      }
      user = sessionUser;
    }

    // 2. Récupérer le pubkey depuis le body de la requête ou le profil
    const body = await request.json().catch(() => ({}));
    let pubkey = body.pubkey;

    // Si pas de pubkey dans le body, essayer de le récupérer du profil
    if (!pubkey) {
      const { data: profile, error: profileError } = await getSupabaseAdminClient()
        .from('profiles')
        .select('pubkey')
        .eq('id', user.id)
        .single()

      if (profileError || !profile?.pubkey) {
        return NextResponse.json<ApiResponse<null>>({
          success: false,
          error: {
            code: 'NO_PUBKEY',
            message: 'Veuillez d\'abord renseigner votre clé publique de nœud Lightning dans l\'onglet "Mon Nœud"'
          }
        }, { status: 400 })
      }
      pubkey = profile.pubkey;
    }

    // Validation de la pubkey
    if (!mcpLightAPI.isValidPubkey(pubkey)) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: {
          code: 'INVALID_PUBKEY',
          message: 'Clé publique invalide'
        }
      }, { status: 400 })
    }

    // 3. Vérifier la limitation journalière
    const today = new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
    const todayStart = `${today} 00:00:00+00`
    const todayEnd = `${today} 23:59:59+00`

    // Vérifier s'il y a déjà une recommandation générée aujourd'hui
    const { data: existingRecommendation, error: checkError } = await getSupabaseAdminClient()
      .from('daily_recommendations')
      .select('*')
      .eq('user_id', user.id)
      .gte('generated_at', todayStart)
      .lte('generated_at', todayEnd)
      .order('generated_at', { ascending: false })
      .limit(1)

    if (checkError) {
      console.error('Erreur vérification recommandations journalières:', checkError)
    }

    if (existingRecommendation && existingRecommendation.length > 0) {
      // Retourner la recommandation existante d'aujourd'hui
      const existing = existingRecommendation[0]
      return NextResponse.json<ApiResponse<GeneratedRecommendation>>({
        success: true,
        data: {
          id: existing.id,
          ...existing.recommendation_data,
          generated_at: existing.generated_at,
          expires_at: existing.expires_at
        },
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      })
    }

    // 4. Générer une nouvelle recommandation via api.dazno.de
    console.log(`🎯 Génération nouvelle recommandation pour ${pubkey.substring(0, 10)}...`)
    
    try {
      // Appel à l'API MCP Light pour obtenir une recommandation enrichie avec fallback
      let nodeInfo, recommendations, priorities;
      
      try {
        [nodeInfo, recommendations, priorities] = await Promise.all([
          mcpLightAPI.getNodeInfo(pubkey),
          mcpLightAPI.getRecommendations(pubkey),
          mcpLightAPI.getPriorityActions(pubkey, "Recommandation quotidienne Dazia", ["increase_revenue", "optimize_performance"])
        ]);
      } catch (apiError: any) {
        if (apiError.message === 'API_UNAVAILABLE') {
          console.warn('⚠️ API MCP-Light indisponible, utilisation de données de fallback');
          const fallbackData = generateFallbackDaziaData(pubkey);
          nodeInfo = fallbackData.nodeInfo;
          recommendations = fallbackData.recommendations;
          priorities = fallbackData.priorities;
        } else {
          throw apiError;
        }
      }

      // Sélectionner la meilleure action pour la recommandation du jour
      const bestAction: any = priorities.priority_actions?.[0] || recommendations.recommendations?.[0]
      
      if (!bestAction) {
        throw new Error('Aucune recommandation disponible')
      }

      // Enrichir la recommandation avec des détails spécifiques
      const recommendation: GeneratedRecommendation = {
        id: `rec_${Date.now()}`,
        title: bestAction.action || `Optimiser ${bestAction.type || 'nœud'}`,
        description: generateSmartDescription(bestAction, nodeInfo),
        category: bestAction.category || 'performance',
        priority: typeof bestAction.priority === 'number' ? bestAction.priority : 1,
        impact: mapImpact(bestAction.expected_impact || bestAction.impact),
        difficulty: mapDifficulty(bestAction.difficulty),
        estimated_time: bestAction.timeline || generateTimeEstimate(bestAction.difficulty),
        implementation_steps: generateImplementationSteps(bestAction),
        success_criteria: generateSuccessCriteria(bestAction),
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Expire dans 24h
      }

      // 5. Sauvegarder la recommandation en base
      const { error: saveError } = await getSupabaseAdminClient()
        .from('daily_recommendations')
        .insert({
          user_id: user.id,
          pubkey: pubkey,
          generated_at: recommendation.generated_at,
          expires_at: recommendation.expires_at,
          recommendation_data: {
            title: recommendation.title,
            description: recommendation.description,
            category: recommendation.category,
            priority: recommendation.priority,
            impact: recommendation.impact,
            difficulty: recommendation.difficulty,
            estimated_time: recommendation.estimated_time,
            implementation_steps: recommendation.implementation_steps,
            success_criteria: recommendation.success_criteria
          }
        })

      if (saveError) {
        console.warn('Erreur sauvegarde recommandation:', saveError)
        // Continue quand même pour retourner la recommandation
      }

      console.log(`✅ Recommandation générée avec succès pour ${user.email}`)

      return NextResponse.json<ApiResponse<GeneratedRecommendation>>({
        success: true,
        data: recommendation,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      })

    } catch (apiError) {
      console.error('Erreur API dazno.de:', apiError)
      
      // Générer une recommandation de fallback basique
      const fallbackRecommendation: GeneratedRecommendation = {
        id: `fallback_${Date.now()}`,
        title: "Analyser les performances de vos canaux",
        description: "Examinez les statistiques de vos canaux Lightning pour identifier les opportunités d'optimisation des frais et de la liquidité.",
        category: "analysis",
        priority: 1,
        impact: "medium" as const,
        difficulty: "easy" as const,
        estimated_time: "15 minutes",
        implementation_steps: [
          "Accédez à votre interface de gestion de nœud",
          "Consultez les statistiques de chaque canal",
          "Identifiez les canaux sous-performants",
          "Planifiez les ajustements nécessaires"
        ],
        success_criteria: [
          "Identification des canaux problématiques",
          "Compréhension des métriques de performance",
          "Plan d'action défini pour les optimisations"
        ],
        generated_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }

      // Sauvegarder la recommandation de fallback
      await getSupabaseAdminClient()
        .from('daily_recommendations')
        .insert({
          user_id: user.id,
          pubkey: pubkey,
          generated_at: fallbackRecommendation.generated_at,
          expires_at: fallbackRecommendation.expires_at,
          recommendation_data: {
            title: fallbackRecommendation.title,
            description: fallbackRecommendation.description,
            category: fallbackRecommendation.category,
            priority: fallbackRecommendation.priority,
            impact: fallbackRecommendation.impact,
            difficulty: fallbackRecommendation.difficulty,
            estimated_time: fallbackRecommendation.estimated_time,
            implementation_steps: fallbackRecommendation.implementation_steps,
            success_criteria: fallbackRecommendation.success_criteria
          }
        })

      return NextResponse.json<ApiResponse<GeneratedRecommendation>>({
        success: true,
        data: fallbackRecommendation,
        meta: {
          timestamp: new Date().toISOString(),
          version: '1.0'
        }
      })
    }

  } catch (error) {
    console.error('Erreur génération recommandation:', error)
    
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Erreur lors de la génération de la recommandation'
      }
    }, { status: 500 })
  }
}

// Fonctions utilitaires

function generateFallbackDaziaData(pubkey: string) {
  return {
    nodeInfo: {
      pubkey,
      current_stats: {
        alias: 'Nœud Lightning',
        capacity: 50000000,
        channel_count: 8,
        centrality_rank: 5000
      }
    },
    recommendations: {
      recommendations: [
        {
          type: 'channel_optimization',
          priority: 'high',
          reasoning: 'Optimiser la gestion des canaux',
          expected_benefit: 'Amélioration des revenus'
        }
      ]
    },
    priorities: {
      priority_actions: [
        {
          priority: 1,
          action: 'Optimiser la gestion des canaux Lightning',
          timeline: '1-2 semaines',
          expected_impact: 'Amélioration des revenus de routage',
          difficulty: 'medium',
          category: 'channels'
        }
      ]
    }
  };
}

function generateSmartDescription(action: any, nodeInfo: any): string {
  const alias = nodeInfo?.current_stats?.alias || 'votre nœud'
  const capacity = nodeInfo?.current_stats?.capacity
  
  if (action.action?.toLowerCase().includes('channel')) {
    return `Optimisez la gestion des canaux de ${alias} pour améliorer la liquidité et les revenus. ${capacity ? `Capacité actuelle: ${(capacity / 100000000).toFixed(2)} BTC.` : ''}`
  }
  
  if (action.action?.toLowerCase().includes('fee')) {
    return `Ajustez les frais de routage de ${alias} pour maximiser la rentabilité tout en restant compétitif sur le réseau Lightning.`
  }
  
  return action.reason || action.description || `Recommandation personnalisée pour optimiser les performances de ${alias}.`
}

function mapImpact(impact: any): 'low' | 'medium' | 'high' {
  if (typeof impact === 'string') {
    if (impact.toLowerCase().includes('high') || impact.toLowerCase().includes('élevé')) return 'high'
    if (impact.toLowerCase().includes('low') || impact.toLowerCase().includes('faible')) return 'low'
  }
  return 'medium'
}

function mapDifficulty(difficulty: any): 'easy' | 'medium' | 'hard' {
  if (typeof difficulty === 'string') {
    if (difficulty.toLowerCase().includes('easy') || difficulty.toLowerCase().includes('facile')) return 'easy'
    if (difficulty.toLowerCase().includes('hard') || difficulty.toLowerCase().includes('difficile')) return 'hard'
  }
  return 'medium'
}

function generateTimeEstimate(difficulty: any): string {
  switch (mapDifficulty(difficulty)) {
    case 'easy': return '10-15 minutes'
    case 'hard': return '1-2 heures'
    default: return '30-45 minutes'
  }
}

function generateImplementationSteps(action: any): string[] {
  if (action.implementation_details?.steps) {
    return action.implementation_details.steps
  }
  
  // Étapes génériques basées sur le type d'action
  if (action.action?.toLowerCase().includes('channel')) {
    return [
      "Analysez vos canaux existants",
      "Identifiez les opportunités d'optimisation",
      "Planifiez les modifications nécessaires",
      "Implémentez les changements progressivement",
      "Surveillez les résultats"
    ]
  }
  
  return [
    "Évaluez la situation actuelle",
    "Planifiez les actions nécessaires", 
    "Implémentez les changements",
    "Vérifiez les résultats"
  ]
}

function generateSuccessCriteria(action: any): string[] {
  if (action.success_criteria) {
    return action.success_criteria
  }
  
  return [
    "Amélioration des métriques de performance",
    "Aucun impact négatif sur la stabilité",
    "Objectifs d'optimisation atteints"
  ]
} 
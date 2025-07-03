import { NextRequest, NextResponse } from 'next/server'
import { createDaznoApiClient } from '@/lib/services/dazno-api'
import { getSupabaseServerPublicClient } from '@/lib/supabase'
import { z } from 'zod'

export interface DailyRecommendation {
  id: string
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  difficulty: 'easy' | 'medium' | 'hard'
  timeEstimate: string
  implementationSteps: string[]
  successCriteria: string[]
  category: string
  priority: number
  status: 'pending' | 'completed' | 'skipped'
  createdAt: string
  updatedAt: string
}

export interface GeneratedRecommendation {
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

export interface ActionData {
  action?: string
  type?: string
  category?: string
  priority?: number
  expected_impact?: string
  impact?: string
  difficulty?: string
  timeline?: string
  steps?: string[]
  success_metrics?: string[]
}

export interface NodeInfoBasic {
  pubkey: string
  alias?: string
  color?: string
  addresses?: any[]
  capacity?: number
  channels?: any[]
  last_update?: string
}

export interface RecommendationsBasic {
  recommendations: any[]
  timestamp: string
}

export interface PrioritiesBasic {
  priority_actions: ActionData[]
  timestamp: string
}

export interface FallbackData {
  nodeInfo: NodeInfoBasic
  recommendations: RecommendationsBasic
  priorities: PrioritiesBasic
}

// Validation schema
const _recommendationSchema = z.object({
  pubkey: z.string().min(66).max(66),
  category: z.enum(['channels', 'fees', 'liquidity', 'routing', 'security']).optional(),
  priority: z.number().min(1).max(5).optional(),
  status: z.enum(['pending', 'completed', 'skipped']).optional()
})

export async function POST(_request: NextRequest): Promise<Response> {
  try {
    const supabase = getSupabaseServerPublicClient();
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const pubkey = session.user?.user_metadata?.pubkey || null;
    if (!pubkey) {
      return NextResponse.json({ error: 'Aucun nœud associé' }, { status: 400 });
    }

    const daznoApi = createDaznoApiClient();

    const recommendations = await daznoApi.getRecommendations(pubkey);

    return NextResponse.json({ success: true, data: recommendations });

  } catch (error) {
    console.error('Erreur génération recommandation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération des recommandations' },
      { status: 500 }
);
  }
}

// Fonctions utilitaires

function _isValidLightningPubkey(pubkey: string): boolean {
  return /^[0-9a-fA-F]{66}$/.test(pubkey);
}

function _generateFallbackDaziaData(pubkey: string): FallbackData {
  return {
    nodeInfo: {
      pubkey,
      alias: 'Node Offline',
      color: '#000000',
      addresses: [],
      capacity: 0,
      channels: [],
      last_update: new Date().toISOString()
    },
    recommendations: {
      recommendations: [],
      timestamp: new Date().toISOString()
    },
    priorities: {
      priority_actions: [],
      timestamp: new Date().toISOString()
    }
  }
}

function _generateSmartDescription(action: ActionData, nodeInfo: NodeInfoBasic): string {
  const baseDescription = action.action || 'Optimiser votre nœud Lightning'
  const nodeContext = nodeInfo.alias ? ` pour ${nodeInfo.alias}` : ''
  const impact = action.expected_impact ? ` pour ${action.expected_impact}` : ''
  
  return `${baseDescription}${nodeContext}${impact}`
}

function _mapImpact(impact: string | undefined): 'low' | 'medium' | 'high' {
  if (!impact) return 'medium'
  const normalized = impact.toLowerCase()
  if (normalized.includes('high') || normalized.includes('fort')) return 'high'
  if (normalized.includes('low') || normalized.includes('faible')) return 'low'
  return 'medium'
}

function _mapDifficulty(difficulty: string | undefined): 'easy' | 'medium' | 'hard' {
  if (!difficulty) return 'medium'
  const normalized = difficulty.toLowerCase()
  if (normalized.includes('easy') || normalized.includes('facile')) return 'easy'
  if (normalized.includes('hard') || normalized.includes('difficile')) return 'hard'
  return 'medium'
}

function _generateTimeEstimate(difficulty: string | undefined): string {
  switch(_mapDifficulty(difficulty)) {
    case 'easy': return '15-30 minutes'
    case 'hard': return '2-4 heures'
    default: return '1-2 heures'
  }
}

function _generateImplementationSteps(action: ActionData): string[] {
  if (action.steps && action.steps.length > 0) {
    return action.steps
  }

  return [
    'Analyser la situation actuelle',
    'Préparer les changements nécessaires',
    'Appliquer les modifications',
    'Vérifier les résultats'
  ]
}

function _generateSuccessCriteria(action: ActionData): string[] {
  if (action.success_metrics && action.success_metrics.length > 0) {
    return action.success_metrics
  }

  return [
    'Amélioration mesurable des performances',
    'Aucun impact négatif sur la stabilité',
    'Retour positif des pairs connectés'
  ]
}

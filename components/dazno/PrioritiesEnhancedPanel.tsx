'use client'

import React, { useEffect, useState } from 'react'
import { usePrioritiesEnhanced } from '@/hooks/usePrioritiesEnhanced'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared/ui'
import { Badge } from '@/components/shared/ui'
import { Button } from '@/components/shared/ui'
import { Loader2, TrendingUp, AlertTriangle, Target, Clock, DollarSign, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface PrioritiesEnhancedPanelProps {
  pubkey: string
  className?: string
}

export function PrioritiesEnhancedPanel({ pubkey, className }: PrioritiesEnhancedPanelProps) {
  const { data, loading, error, fetchPriorities } = usePrioritiesEnhanced()
  const [selectedGoals, _setSelectedGoals] = useState<string[]>([
    'increase_revenue',
    'improve_centrality',
    'optimize_channels'
  ])

  useEffect(() => {
    if (pubkey) {
      fetchPriorities(pubkey, {
        goals: selectedGoals,
        context: "Je veux optimiser mon nœud Lightning pour maximiser les revenus et améliorer ma position dans le réseau",
        logActivity: true
      })
    }
  }, [pubkey, fetchPriorities, selectedGoals]);

  const handleRefresh = () => {
    fetchPriorities(pubkey, {
      goals: selectedGoals,
      context: "Analyse actualisée pour optimisation continue",
      logActivity: true
    })
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUrgencyIcon = (urgency?: string) => {
    switch (urgency) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-500" />
      case 'medium': return <Clock className="w-4 h-4 text-yellow-500" />
      default: return <Target className="w-4 h-4 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn("border-red-200", className)}>
        <CardContent className="text-center py-8">
          <p className="text-red-600 mb-4">Erreur: {error.message}</p>
          <Button onClick={handleRefresh} variant="outline">
            Réessayer
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Résumé du nœud */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Analyse Enhanced du Nœud</span>
            <Button onClick={handleRefresh} size="sm" variant="outline">
              Actualiser
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900">{data.node_summary.alias}</h4>
              <p className="text-sm text-blue-700">
                Capacité: {data.node_summary.capacity_btc} BTC
              </p>
              <p className="text-sm text-blue-700">
                {data.node_summary.channel_count} canaux
              </p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900">Score de Santé</h4>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-green-700">
                  {data.node_summary.health_score}/100
                </div>
                <Zap className="w-6 h-6 text-green-600" />
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900">Score d'Opportunité</h4>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-purple-700">
                  {data.ai_analysis.opportunity_score}/100
                </div>
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Analyse AI */}
      <Card>
        <CardHeader>
          <CardTitle>Analyse Intelligence Artificielle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Résumé</h4>
            <p className="text-gray-700">{data.ai_analysis.summary}</p>
          </div>
          
          {data.ai_analysis.key_insights.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Points Clés</h4>
              <ul className="list-disc list-inside space-y-1">
                {data.ai_analysis.key_insights.map((insight: any, index: any) => (
                  <li key={index} className="text-gray-700">{insight}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h4 className="font-semibold mb-2">Évaluation des Risques</h4>
            <p className="text-gray-700">{data.ai_analysis.risk_assessment}</p>
          </div>
        </CardContent>
      </Card>

      {/* Plan d'action */}
      <Card>
        <CardHeader>
          <CardTitle>Plan d'Action Structuré</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.action_plan.immediate_actions.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Actions Immédiates
              </h4>
              <ul className="space-y-2">
                {data.action_plan.immediate_actions.map((action: any, index: any) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span className="text-gray-700">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {data.action_plan.short_term_goals.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                Objectifs Court Terme
              </h4>
              <ul className="space-y-2">
                {data.action_plan.short_term_goals.map((goal: any, index: any) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">•</span>
                    <span className="text-gray-700">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              Vision Long Terme
            </h4>
            <p className="text-gray-700">{data.action_plan.long_term_vision}</p>
          </div>
        </CardContent>
      </Card>

      {/* Actions prioritaires détaillées */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Prioritaires Détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.priority_actions.map((action: any, index: any) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getUrgencyIcon(action.urgency)}
                    <div>
                      <h4 className="font-semibold">{action.action}</h4>
                      <p className="text-sm text-gray-600 mt-1">{action.expected_impact}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="default">
                      {action.difficulty}
                    </Badge>
                    <Badge variant="info">Priorité {action.priority}</Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {action.timeline}
                  </span>
                  {action.cost_estimate && (
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {action.cost_estimate} sats
                    </span>
                  )}
                </div>
                
                {action.implementation_details && action.implementation_details.steps.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Étapes:</p>
                    <ol className="list-decimal list-inside text-xs text-gray-600 space-y-1">
                      {action.implementation_details.steps.map((step: any, i: any) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                {action.implementation_details && action.implementation_details.requirements.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Prérequis:</p>
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                      {action.implementation_details.requirements.map((req: any, i: any) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {action.implementation_details && action.implementation_details.tools_needed && action.implementation_details.tools_needed.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Outils nécessaires:</p>
                    <div className="flex flex-wrap gap-1">
                      {action.implementation_details.tools_needed.map((tool: any, i: any) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

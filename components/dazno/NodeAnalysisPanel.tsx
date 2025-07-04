'use client';
import React from 'react';

import { useState } from 'react'
import { useDaznoAPI } from '@/hooks/useDaznoAPI'
import { DaznoPriorityRequest } from '@/types/dazno-api'

export interface NodeAnalysisPanelProps {
  pubkey: string
  className?: string
}

export const NodeAnalysisPanel: React.FC<NodeAnalysisPanelProps> = ({ 
  pubkey, 
  className = '' 
}) => {
  const dazno = useDaznoAPI()
  const [context, setContext] = useState<DaznoPriorityRequest['context']>('intermediate')
  const [selectedGoals, setSelectedGoals] = useState<DaznoPriorityRequest['goals']>(['increase_revenue'])

  const handleCompleteAnalysis = async () => {
    await dazno.getCompleteAnalysis(pubkey, context, selectedGoals)
  }

  const handlePriorityActions = async () => {
    await dazno.getPriorityActions(pubkey, {
      context,
      goals: selectedGoals,
      preferences: {
        risk_tolerance: 'medium',
        investment_horizon: 'medium_term'
      }
    })
  }

  if (dazno.loading) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (dazno.error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex">
          <div className="text-red-800">
            <h3 className="text-sm font-medium">{t('NodeAnalysisPanel.erreur_danalyse')}</h3>
            <p className="text-sm mt-1">{dazno.error}</p>
          </div>
          <button
            onClick={dazno.clearError}
            className="ml-auto text-red-600 hover:text-red-800"
          >
            ×
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg shadow ${className}`}>
      {/* En-tête de contrôle */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Analyse Lightning Network
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau d'expertise
            </label>
            <select
              value={context}
              onChange={(e: any) => setContext(e.target.value as DaznoPriorityRequest['context'])}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="beginner">{t('NodeAnalysisPanel.dbutant')}</option>
              <option value="intermediate">{t('NodeAnalysisPanel.intermdiaire')}</option>
              <option value="expert">Expert</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objectifs
            </label>
            <div className="space-y-2">
              {[
                { value: 'increase_revenue', label: "NodeAnalysisPanel.nodeanalysispanelnodeanalysisp" },
                { value: 'improve_connectivity', label: "NodeAnalysisPanel.nodeanalysispanelnodeanalysisp" },
                { value: 'reduce_costs', label: "NodeAnalysisPanel.nodeanalysispanelnodeanalysisp" }
              ].map(goal => (
                <label key={goal.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal.value as any)}
                    onChange={(e: any) => {
                      if (e.target.checked) {
                        setSelectedGoals([...selectedGoals, goal.value as any])
                      } else {
                        setSelectedGoals(selectedGoals.filter(g => g !== goal.value))
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{goal.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCompleteAnalysis}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
          >
            Analyse complète
          </button>
          <button
            onClick={handlePriorityActions}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
          >
            Actions prioritaires
          </button>
        </div>
      </div>

      {/* Résultats de l'analyse complète */}
      {dazno.complete && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Vue d'ensemble du nœud
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {dazno.complete.health_score}%
              </div>
              <div className="text-sm text-gray-600">{t('NodeAnalysisPanel.score_de_sant')}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {dazno.complete.node_info.channels_count}
              </div>
              <div className="text-sm text-gray-600">Canaux</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(dazno.complete.node_info.capacity_btc * 100) / 100}
              </div>
              <div className="text-sm text-gray-600">BTC</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                #{dazno.complete.node_info.centrality_rank}
              </div>
              <div className="text-sm text-gray-600">{t('NodeAnalysisPanel.rang_centralit')}</div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">{t('NodeAnalysisPanel.prochaines_tapes')}</h4>
            <ul className="space-y-1">
              {dazno.complete.next_steps.map((step: any, index: any) => (
                <li key={index} className="text-sm text-gray-700 flex items-start">
                  <span className="text-blue-600 mr-2">{index + 1}.</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Actions prioritaires */}
      {dazno.priorities && (
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Actions prioritaires OpenAI
            </h3>
            {dazno.priorities.report_files && (
              <div className="flex gap-2">
                <a
                  href={`/api/reports/${dazno.priorities.report_files.node_report}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  download
                >
                  📄 Rapport technique
                </a>
                <a
                  href={`/api/reports/${dazno.priorities.report_files.openai_recommendations}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  download
                >
                  🎯 Recommandations IA
                </a>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {dazno.priorities.priority_actions.map((action: any, index: any) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">
                    Priorité #{action.priority}: {action.action}
                  </h4>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      action.difficulty === 'facile' ? 'bg-green-100 text-green-800' :
                      action.difficulty === 'moyen' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {action.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {action.timeframe}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{action.reasoning}</p>
                <p className="text-sm font-medium text-green-700">
                  Impact attendu: {action.impact}
                </p>
              </div>
            ))}
          </div>

          {dazno.priorities.openai_analysis && (
            <div className="mt-6 bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">{t('NodeAnalysisPanel.analyse_openai')}</h4>
              <p className="text-sm text-blue-800 whitespace-pre-wrap">
                {dazno.priorities.openai_analysis}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NodeAnalysisPanel 
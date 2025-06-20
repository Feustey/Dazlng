'use client';

import React, { useState, useEffect } from 'react';
import { useMCPLight } from '@/hooks/useMCPLight';
import { NodeAnalysisResult, PriorityAction, SparkSeerRecommendation } from '@/lib/services/mcp-light-api';
import Card, { CardContent, CardHeader, CardTitle } from '@/components/shared/ui/Card';
import Badge from '@/components/shared/ui/Badge';
import Button from '@/components/shared/ui/Button';
import { Alert, AlertDescription } from '@/components/shared/ui/Alert';
import { Loader2, TrendingUp, Zap, Target, AlertCircle, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';

export interface NodeAnalysisProps {
  pubkey: string | null;
  onAnalysisComplete?: (result: NodeAnalysisResult) => void;
  userContext?: string;
  userGoals?: string[];
}

const NodeAnalysis: React.FC<NodeAnalysisProps> = ({ 
  pubkey, 
  onAnalysisComplete,
  userContext = "Je veux optimiser les performances de mon nœud Lightning",
  userGoals = ['increase_revenue', 'improve_centrality']
}) => {
  const { analyzeNode, loading: apiLoading, error: apiError } = useMCPLight();
  const [analysis, setAnalysis] = useState<NodeAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeNode = async () => {
    if (!pubkey) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeNode(pubkey, userContext, userGoals);
      setAnalysis(result);
      onAnalysisComplete?.(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'analyse';
      setError(errorMessage);
      console.error('Erreur analyse:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pubkey) {
      handleAnalyzeNode();
    }
  }, [pubkey, handleAnalyzeNode]);

  const getHealthScoreColor = (score: number): string => {
    if (score >= 70) return 'text-green-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPriorityBadgeColor = (priority: number): 'destructive' | 'default' | 'secondary' | 'outline' => {
    if (priority <= 2) return 'destructive';
    if (priority <= 4) return 'default';
    return 'secondary';
  };

  const getDifficultyColor = (difficulty: 'low' | 'medium' | 'high'): string => {
    switch (difficulty) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (apiLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        <span>Initialisation de l'API Lightning...</span>
      </div>
    );
  }

  if (apiError) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>❌ Erreur API: {apiError}</AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg font-medium">Analyse en cours...</p>
            <p className="text-sm text-gray-600">
              Récupération des données SparkSeer et génération des recommandations OpenAI
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <h3 className="font-semibold">❌ Erreur d'Analyse</h3>
            <p>{error}</p>
            <Button onClick={handleAnalyzeNode} variant="outline" size="sm">
              Réessayer
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!analysis) {
    return (
      <div className="p-8 text-center">
        <Zap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">
          Entrez une clé publique de nœud pour commencer l'analyse
        </p>
      </div>
    );
  }

  const { recommendations, priorities, summary } = analysis;

  return (
    <div className="space-y-6 p-4">
      {/* Résumé du Nœud */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6" />
            {summary.node_alias}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm opacity-80">Capacité</p>
              <p className="text-lg font-bold">
                {summary.capacity_btc} BTC
              </p>
              <p className="text-xs opacity-60">
                ({summary.capacity_sats} sats)
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-80">Canaux</p>
              <p className="text-lg font-bold">{summary.channel_count}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-80">Rang Centralité</p>
              <p className="text-lg font-bold">#{summary.centrality_rank}</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-80">Score Santé</p>
              <p className={`text-lg font-bold ${getHealthScoreColor(summary.health_score)}`}>
                {summary.health_score}/100
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions Prioritaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Actions Prioritaires
            <Badge variant="secondary">{summary.priority_actions_count}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priorities.priority_actions.map((action: PriorityAction, index: number) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <Badge variant={getPriorityBadgeColor(action.priority)}>
                    #{action.priority}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-2">{action.action}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                    <p><strong>Timeline:</strong> {action.timeline}</p>
                    <p><strong>Impact:</strong> {action.expected_impact}</p>
                    <p className={getDifficultyColor(action.difficulty)}>
                      <strong>Difficulté:</strong> {action.difficulty}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommandations SparkSeer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Recommandations SparkSeer
            <Badge variant="secondary">{summary.recommendations_count}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.recommendations.map((rec: SparkSeerRecommendation, index: number) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <Badge variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}>
                    {rec.priority}
                  </Badge>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{rec.type}</h4>
                    {rec.confidence_score && (
                      <Badge variant="outline">
                        {Math.round(rec.confidence_score * 100)}% confiance
                      </Badge>
                    )}
                  </div>
                  {rec.reasoning && (
                    <p className="text-sm text-gray-600 mb-2">{rec.reasoning}</p>
                  )}
                  {rec.expected_benefit && (
                    <p className="text-sm font-medium text-green-600">
                      <strong>Bénéfice:</strong> {rec.expected_benefit}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analyse OpenAI */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Analyse OpenAI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-gray-700">
              {priorities.openai_analysis}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button onClick={handleAnalyzeNode} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualiser l'Analyse
        </Button>
        <Button
          onClick={() => window.open('https://api.dazno.de/docs', '_blank')}
          variant="outline"
          className="flex items-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Documentation API
        </Button>
      </div>
    </div>
  );
};

export default NodeAnalysis; 
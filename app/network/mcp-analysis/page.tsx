'use client';

import React, { useState } from 'react';
import { useMCPLight } from '@/hooks/useMCPLight';
import NodeAnalysis from '@/components/shared/NodeAnalysis';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/shared/ui';
import { Alert, AlertDescription } from '@/components/shared/ui/Alert';
import { Zap, Search, Globe, Database } from 'lucide-react';

export const dynamic = 'force-dynamic';
export default function MCPAnalysisPage() {
  const [pubkey, setPubkey] = useState('');
  const [validatedPubkey, setValidatedPubkey] = useState<string | null>(null);
  const { initialized, loading, error, checkHealth, isValidPubkey } = useMCPLight();
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const handlePubkeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidPubkey(pubkey)) {
      setValidatedPubkey(pubkey);
    } else {
      alert('Clé publique invalide. Elle doit faire 66 caractères hexadécimaux.');
    }
  };

  const handleHealthCheck = async () => {
    try {
      const status = await checkHealth();
      setHealthStatus(status);
    } catch (err) {
      console.error('Erreur health check:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">Initialisation de l'API Lightning...</h2>
          <p className="text-gray-600">Récupération des credentials JWT...</p>
        </div>
      </div>
  );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Alert type="error">
            <AlertDescription>
              <h3 className="font-semibold mb-2">❌ Erreur d'Initialisation API</h3>
              <p>{error}</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
  );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Zap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Lightning Network Intelligence
                </h1>
                <p className="text-gray-600">
                  Analysez votre nœud Lightning avec SparkSeer + OpenAI
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`h-3 w-3 rounded-full ${initialized ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-600">
                {initialized ? 'API Connectée' : 'API Déconnectée'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Form de saisie pubkey */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Analyser un Nœud
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePubkeySubmit} className="space-y-4">
                  <div>
                    <label htmlFor="pubkey" className="block text-sm font-medium text-gray-700 mb-2">
                      Clé publique du nœud
                    </label>
                    <input
                      id="pubkey"
                      type="text"
                      value={pubkey}
                      onChange={(e: any) => setPubkey(e.target.value)}
                      placeholder="Entrez la clé publique (66 caractères hex)"
                      maxLength={66}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {pubkey.length}/66 caractères
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={!initialized || pubkey.length !== 66}
                    className="w-full"
                  >
                    Analyser le Nœud
                  </Button>
                </form>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">Exemple de pubkey :</p>
                  <button
                    onClick={() => setPubkey('02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b')}
                    className="text-xs font-mono text-blue-600 hover:text-blue-800 break-all"
                  >
                    02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Status API */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  État de l'API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Statut :</span>
                    <span className={`text-sm font-medium ${initialized ? 'text-green-600' : 'text-red-600'}`}>
                      {initialized ? '✅ Connectée' : '❌ Déconnectée'}
                    </span>
                  </div>
                  
                  <Button
                    onClick={handleHealthCheck}
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    Vérifier l'état de santé
                  </Button>

                  {healthStatus && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="text-xs font-medium text-gray-700">Réponse API :</p>
                      <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                        {JSON.stringify(healthStatus, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Ressources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a
                    href="https://api.dazno.de/docs"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800"
                  >
                    📚 Documentation API
                  </a>
                  <a
                    href="https://sparkseer.space"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800"
                  >
                    🔍 SparkSeer
                  </a>
                  <a
                    href="https://openai.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-blue-600 hover:text-blue-800"
                  >
                    🤖 OpenAI
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <NodeAnalysis 
              pubkey={validatedPubkey}
              onAnalysisComplete={(result: any) => {
                console.log('Analyse terminée:', result);
              }}
              userContext="Je veux optimiser les performances de mon nœud Lightning Network"
              userGoals={['increase_revenue', 'improve_centrality', 'optimize_liquidity']}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>
              Powered by{' '}
              <span className="font-semibold text-blue-600">MCP-Light API</span> •{' '}
              <span className="font-semibold text-green-600">SparkSeer</span> +{' '}
              <span className="font-semibold text-purple-600">OpenAI</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

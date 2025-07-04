"use client";

import React, { useState } from "react";
import { useMCPLight } from "@/hooks/useMCPLight";
import NodeAnalysis from "@/components/shared/NodeAnalysis";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@/components/shared/ui";
import { Alert, AlertDescription } from "@/components/shared/ui/Alert";
import { Zap, Search, Globe, Database } from "@/components/shared/ui/IconRegistry";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";

export default function MCPAnalysisPage() {
  const { t } = useAdvancedTranslation("mcp-analysis");

  const [pubkey, setPubkey] = useState('');
  const [validatedPubkey, setValidatedPubkey] = useState<string | null>(null);
  const { initialized, loading, error, isValidPubkey } = useMCPLight();
  const [healthStatus, setHealthStatus] = useState<any>(null);

  const handlePubkeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidPubkey(pubkey)) {
      setValidatedPubkey(pubkey);
    } else {
      alert("Clé publique invalide. Elle doit faire 66 caractères hexadécimaux.");
    }
  };

  const handleHealthCheck = async () => {
    try {
      // Simuler un health check pour l'instant
      setHealthStatus({ status: "healthy", timestamp: new Date().toISOString() });
    } catch (err) {
      console.error("Erreur health check:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900">
            {t("network.initialisation_de_lapi_lightning")}
          </h2>
          <p className="text-gray-600">
            {t("network.recuperation_des_credentials_jwt")}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto">
          <Alert>
            <AlertDescription>
              <h3 className="font-semibold mb-2">
                {t("network.erreur_dinitialisation_api")}
              </h3>
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
              <div className={`h-3 w-3 rounded-full ${initialized ? "bg-green-500" : "bg-red-500"}`}></div>
              <span className="text-sm text-gray-600">
                {initialized ? "API Connectée" : "API Déconnectée"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Form de saisie pubkey */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>Analyser un Nœud</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePubkeySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Clé publique du nœud
                    </label>
                    <input
                      type="text"
                      value={pubkey}
                      onChange={(e) => setPubkey(e.target.value)}
                      placeholder={t("page.entrez_la")}
                      maxLength={66}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {pubkey.length}/66 caractères
                    </p>
                  </div>
                  <Button type="submit" className="w-full">
                    Analyser le Nœud
                  </Button>
                </form>

                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">
                    {t("network.exemple_de_pubkey")}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPubkey("02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b")}
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
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>État de l'API</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t("network.statut")}</span>
                    <span className="text-sm font-medium">
                      {initialized ? "✅ Connectée" : "❌ Déconnectée"}
                    </span>
                  </div>
                  
                  <Button onClick={handleHealthCheck} className="w-full">
                    Vérifier l'état de santé
                  </Button>

                  {healthStatus && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-gray-700 mb-2">
                        {t("network.reponse_api")}
                      </p>
                      <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
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
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Ressources</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                    📚 Documentation API
                  </a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                    🔍 SparkSeer
                  </a>
                  <a href="#" className="block text-sm text-blue-600 hover:text-blue-800">
                    🤖 OpenAI
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {validatedPubkey && (
              <NodeAnalysis pubkey={validatedPubkey} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
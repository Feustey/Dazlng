"use client";

import React, { useState, useEffect, useCallback } from "react";

interface ConnectionStatus {
  status: string;
  message?: string;
  error?: string;
}

interface NodeStatus {
  nodes: Array<{
    id: string;
    status: string;
  }>;
  status?: number;
  data?: string;
  message?: string;
  error?: string;
}

interface SystemInfo {
  version: string;
  uptime: number;
  memory: {
    used: number;
    total: number;
  };
  message?: string;
  error?: string;
}

export default function TestApiPage() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [nodesStatus, setNodesStatus] = useState<NodeStatus | null>(null);
  const [nodesLoading, setNodesLoading] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [systemInfoLoading, setSystemInfoLoading] = useState(false);

  const fetchSystemInfo = useCallback(async () => {
    setSystemInfoLoading(true);
    try {
      const response = await fetch("/api/system-info");
      const data = await response.json();
      setSystemInfo(data);
    } catch (error) {
      setSystemInfo({
        version: "unknown",
        uptime: 0,
        memory: { used: 0, total: 0 },
        message: "Erreur lors de la récupération des informations système",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setSystemInfoLoading(false);
    }
  }, []);

  const testConnection = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/test-mcp-connection");
      const data = await response.json();
      setConnectionStatus(data);
    } catch (error) {
      setConnectionStatus({
        status: "error",
        message: "Erreur de connexion au serveur",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const testNodesEndpoint = useCallback(async () => {
    setNodesLoading(true);
    try {
      const response = await fetch("/api/nodes");
      const data = await response.json();
      setNodesStatus({
        nodes: [],
        status: response.status,
        data: Array.isArray(data) ? `${data.length} nœuds trouvés` : data,
      });
    } catch (error) {
      setNodesStatus({
        nodes: [],
        message: "Erreur lors de la récupération des nœuds",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setNodesLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSystemInfo();
  }, [fetchSystemInfo]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Tests et Diagnostics</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Informations Système</h2>
        <button
          onClick={fetchSystemInfo}
          disabled={systemInfoLoading}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {systemInfoLoading
            ? "Chargement..."
            : "Rafraîchir les informations système"}
        </button>

        {systemInfo && (
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(systemInfo, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Test de connexion à l&apos;API
        </h2>
        <button
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {loading ? "Chargement..." : "Tester la connexion"}
        </button>

        {connectionStatus && (
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(connectionStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Test de l&apos;endpoint /api/nodes
        </h2>
        <button
          onClick={testNodesEndpoint}
          disabled={nodesLoading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          {nodesLoading ? "Chargement..." : "Tester l'endpoint /api/nodes"}
        </button>

        {nodesStatus && (
          <div className="bg-gray-100 p-4 rounded">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(nodesStatus, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

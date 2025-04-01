"use client";

import React, { useState, useEffect } from "react";

export default function TestApiPage() {
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [nodesStatus, setNodesStatus] = useState<any>(null);
  const [nodesLoading, setNodesLoading] = useState(false);
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [systemInfoLoading, setSystemInfoLoading] = useState(false);

  async function testConnection() {
    setLoading(true);
    try {
      const response = await fetch("/api/test-mcp-connection");
      const data = await response.json();
      setConnectionStatus(data);
    } catch (error) {
      setConnectionStatus({
        message: "Erreur de connexion au serveur",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setLoading(false);
    }
  }

  async function testNodesEndpoint() {
    setNodesLoading(true);
    try {
      const response = await fetch("/api/nodes");
      const data = await response.json();
      setNodesStatus({
        status: response.status,
        data: Array.isArray(data) ? `${data.length} nœuds trouvés` : data,
      });
    } catch (error) {
      setNodesStatus({
        message: "Erreur lors de la récupération des nœuds",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setNodesLoading(false);
    }
  }

  async function fetchSystemInfo() {
    setSystemInfoLoading(true);
    try {
      const response = await fetch("/api/system-info");
      const data = await response.json();
      setSystemInfo(data);
    } catch (error) {
      setSystemInfo({
        message: "Erreur lors de la récupération des informations système",
        error: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setSystemInfoLoading(false);
    }
  }

  useEffect(() => {
    fetchSystemInfo();
  }, []);

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

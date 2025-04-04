"use client";

import * as React from "react";

import { useState } from "react";
import { NWCConnector } from "../lib/nwc";

interface NWCConnectProps {
  onConnect: (connector: NWCConnector) => void;
}

export default function NWCConnect({ onConnect }: NWCConnectProps) {
  const [connectionString, setConnectionString] = useState("");
  const [error, setError] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError("");

      const connector = new NWCConnector(connectionString);
      await connector.connect();

      onConnect(connector);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        Connecter votre portefeuille Alby
      </h2>

      <div className="space-y-4">
        <div>
          <label
            htmlFor="connectionString"
            className="block text-sm font-medium text-gray-700"
          >
            Chaîne de connexion NWC
          </label>
          <input
            type="text"
            id="connectionString"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="nostr+walletconnect://..."
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <button
          onClick={handleConnect}
          disabled={isConnecting || !connectionString}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
        >
          {isConnecting ? "Connexion..." : "Connecter"}
        </button>

        <p className="text-sm text-gray-500">
          Pour obtenir votre chaîne de connexion NWC, ouvrez Alby et allez dans
          Paramètres &gt; Connexions &gt; Nouvelle connexion
        </p>
      </div>
    </div>
  );
}

"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { useNode } from "../contexts/NodeContext";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

interface Node {
  pubkey: string;
  alias: string;
  capacity: number;
}

interface NodeSearchProps {
  placeholder?: string;
}

const NodeSearch: React.FC<NodeSearchProps> = ({
  placeholder = "Rechercher un nœud par alias ou pubkey...",
}) => {
  const { selectedNode, setSelectedNode } = useNode();
  const [searchTerm, setSearchTerm] = useState("");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNodes = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Utiliser l'API route de Next.js au lieu d'appeler directement mcpService
        const response = await fetch("/api/nodes");

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setNodes(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des nœuds:", err);
        setError(
          "Impossible de charger les nœuds. Veuillez réessayer plus tard."
        );
        setNodes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNodes();
  }, []);

  const filteredNodes = nodes
    .filter(
      (node) =>
        node.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        node.pubkey.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 10); // Limiter à 10 résultats pour de meilleures performances

  return (
    <div className="relative w-96">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          placeholder={placeholder}
          className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isLoading && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg p-4 text-center">
          Chargement des nœuds...
        </div>
      )}

      {error && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 rounded-lg shadow-lg p-4 text-center text-red-500">
          {error}
        </div>
      )}

      {isOpen && searchTerm && !isLoading && !error && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredNodes.length > 0 ? (
            filteredNodes.map((node) => (
              <div
                key={node.pubkey}
                onClick={() => {
                  setSelectedNode(node);
                  setSearchTerm(node.alias || node.pubkey);
                  setIsOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
              >
                <div className="font-medium text-gray-900 dark:text-white">
                  {node.alias || "Nœud sans alias"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {node.pubkey.substring(0, 20)}...
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  Capacité: {formatCapacity(node.capacity)}
                </div>
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-center text-gray-500 dark:text-gray-400">
              Aucun nœud trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Fonction utilitaire pour formater la capacité en sats ou BTC
const formatCapacity = (capacityInSats: number): string => {
  if (!capacityInSats && capacityInSats !== 0) return "N/A";

  if (capacityInSats >= 100000000) {
    return `${(capacityInSats / 100000000).toFixed(2)} BTC`;
  }
  return `${capacityInSats.toLocaleString()} sats`;
};

export default NodeSearch;

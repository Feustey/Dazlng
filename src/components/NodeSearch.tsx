import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNode } from '@/contexts/NodeContext';

interface Node {
  pubkey: string;
  alias: string;
  capacity: number;
}

const NodeSearch: React.FC = () => {
  const { selectedNode, setSelectedNode } = useNode();
  const [searchTerm, setSearchTerm] = useState('');
  const [nodes, setNodes] = useState<Node[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch('https://1ml.com/node?json=true');
        const data = await response.json();
        setNodes(data.nodes || []);
      } catch (error) {
        console.error('Erreur lors de la récupération des nœuds:', error);
      }
    };

    fetchNodes();
  }, []);

  const filteredNodes = nodes.filter(node =>
    node.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.pubkey.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-96">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Rechercher un nœud par alias ou pubkey..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      {isOpen && searchTerm && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredNodes.map((node) => (
            <div
              key={node.pubkey}
              onClick={() => {
                setSelectedNode(node);
                setSearchTerm(node.alias);
                setIsOpen(false);
              }}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              <div className="font-medium text-gray-900 dark:text-white">{node.alias}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{node.pubkey}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NodeSearch; 
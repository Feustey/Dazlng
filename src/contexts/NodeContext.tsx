'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Node {
  pubkey: string;
  alias: string;
  capacity: number;
}

interface NodeContextType {
  selectedNode: Node;
  setSelectedNode: (node: Node) => void;
}

const DEFAULT_NODE = {
  pubkey: '02778f4a4eb3a2344b9fd8ee72e7ec5f03f803e5f5273e2e1a2af508910cf2b12b',
  alias: 'Default Node',
  capacity: 0
};

const NodeContext = createContext<NodeContextType | undefined>(undefined);

export const NodeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedNode, setSelectedNode] = useState<Node>(DEFAULT_NODE);

  return (
    <NodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </NodeContext.Provider>
  );
};

export const useNode = () => {
  const context = useContext(NodeContext);
  if (context === undefined) {
    throw new Error('useNode must be used within a NodeProvider');
  }
  return context;
}; 
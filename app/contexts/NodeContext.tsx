'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Node {
  pubkey: string;
  alias: string;
  capacity: number;
}

interface NodeContextType {
  selectedNode: Node | null;
  setSelectedNode: (node: Node | null) => void;
}

const NodeContext = createContext<NodeContextType>({
  selectedNode: null,
  setSelectedNode: () => {},
});

export const useNode = () => useContext(NodeContext);

export const NodeProvider = ({ children }: { children: ReactNode }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <NodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </NodeContext.Provider>
  );
}; 
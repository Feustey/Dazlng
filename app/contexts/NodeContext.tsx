"use client";

import * as React from "react";

import { createContext, useContext, useState } from "react";

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
  setSelectedNode: () => {
    // Cette méthode est implémentée dans le NodeProvider
    console.warn("setSelectedNode called before provider initialization");
  },
});

export const useNode = () => useContext(NodeContext);

export const NodeProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <NodeContext.Provider value={{ selectedNode, setSelectedNode }}>
      {children}
    </NodeContext.Provider>
  );
};

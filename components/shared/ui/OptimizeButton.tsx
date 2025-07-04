"use client";

import { useState } from "react";

export interface OptimizeButtonProps {
  nodeId: string;
}

export default function OptimizeButton({ nodeId }: OptimizeButtonProps): JSX.Element {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async (): Promise<void> => {
    setIsOptimizing(true);
    try {
      const response = await fetch(`/api/network/optimize/${nodeId}`, {
        method: "POST"});
      
      if (!response.ok) {
        throw new Error("Échec de l'optimisatio\n);
      }

      window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de l'optimisatio\n);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (</void>
    <button>
      {isOptimizing ? "Optimisation..." : "Optimiser le Node"}</button>
    </button>);
`
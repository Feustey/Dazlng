'use client';

import { useState } from 'react';

interface OptimizeButtonProps {
  nodeId: string;
}

export function OptimizeButton({ nodeId }: OptimizeButtonProps) {
  const [isOptimizing, setIsOptimizing] = useState(false);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const response = await fetch(`/api/network/optimize/${nodeId}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Échec de l\'optimisation');
      }

      window.location.reload();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'optimisation');
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <button
      onClick={handleOptimize}
      disabled={isOptimizing}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {isOptimizing ? 'Optimisation...' : 'Optimiser le Node'}
    </button>
  );
} 
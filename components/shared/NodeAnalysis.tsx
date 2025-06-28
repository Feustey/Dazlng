'use client';

import React, { useEffect, useState } from 'react';
import { daznoApi } from '@/lib/services/dazno-api';
import { useToast } from '@/hooks/useToast';
import Button from '@/components/shared/ui/button';
import { NodeStatus } from '@/lib/services/dazno-api';

interface NodeAnalysisProps {
  pubkey: string;
  className?: string;
}

const NodeAnalysis: React.FC<NodeAnalysisProps> = ({
  pubkey,
  className = '',
}) => {
  const [nodeInfo, setNodeInfo] = useState<NodeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNodeInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const info = await daznoApi.getNodeStatus(pubkey);
        setNodeInfo(info);
      } catch (err) {
        console.error('Failed to fetch node info:', err);
        setError('Erreur lors de la récupération des informations du nœud');
        toast({
          title: 'Erreur',
          description: 'Impossible de récupérer les informations du nœud',
          variant: 'error',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNodeInfo();
  }, [pubkey, toast]);

  if (loading) {
    return (
      <div className={`flex justify-center items-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error || !nodeInfo) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <p className="text-red-500 mb-4">{error || 'Erreur inattendue'}</p>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">
          {nodeInfo.alias}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-gray-600">
              Status: <span className={`font-medium ${nodeInfo.status === 'online' ? 'text-green-500' : 'text-red-500'}`}>
                {nodeInfo.status === 'online' ? 'En ligne' : 'Hors ligne'}
              </span>
            </p>
            
            {nodeInfo.lastSeen && (
              <p className="text-gray-600">
                Dernière activité: <span className="font-medium">
                  {new Date(nodeInfo.lastSeen).toLocaleString()}
                </span>
              </p>
            )}
          </div>

          <div className="space-y-2">
            {nodeInfo.channels !== undefined && (
              <p className="text-gray-600">
                Canaux: <span className="font-medium">{nodeInfo.channels}</span>
              </p>
            )}
            
            {nodeInfo.capacity !== undefined && (
              <p className="text-gray-600">
                Capacité: <span className="font-medium">
                  {nodeInfo.capacity.toLocaleString()} sats
                </span>
              </p>
            )}
          </div>
        </div>

        {nodeInfo.metrics && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Métriques</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600">Disponibilité</p>
                <div className="flex items-center mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${nodeInfo.metrics.availability * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {Math.round(nodeInfo.metrics.availability * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-600">Fiabilité</p>
                <div className="flex items-center mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${nodeInfo.metrics.reliability * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {Math.round(nodeInfo.metrics.reliability * 100)}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-gray-600">Performance</p>
                <div className="flex items-center mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${nodeInfo.metrics.performance * 100}%` }}
                    />
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {Math.round(nodeInfo.metrics.performance * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeAnalysis; 
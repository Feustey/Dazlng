import { MCPClient } from '@/lib/mcp-client';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    id: string;
  };
}

async function NodeDetails({ id }: { id: string }): Promise<JSX.Element> {
  const client = MCPClient.getInstance();
  
  try {
    const [stats, history] = await Promise.all([
      client.getNodeStats(id),
      client.getNodeHistory(id)
    ]);

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Node {id}</h1>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h2 className="text-xl mb-2">Statistiques</h2>
            <pre>{JSON.stringify(stats, null, 2)}</pre>
          </div>
          <div>
            <h2 className="text-xl mb-2">Historique</h2>
            <pre>{JSON.stringify(history, null, 2)}</pre>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export default function NodePage({ params }: PageProps) {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <NodeDetails id={params.id} />
    </Suspense>
  );
} 
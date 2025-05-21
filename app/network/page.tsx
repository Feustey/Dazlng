import { MCPClient } from '@/lib/mcp-client';
import { Suspense } from 'react';

async function NetworkSummary(): Promise<JSX.Element> {
  const client = MCPClient.getInstance();
  const summary = await client.getNetworkSummary();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Résumé du Réseau</h1>
      <pre>{JSON.stringify(summary, null, 2)}</pre>
    </div>
  );
}

export default function Page(): JSX.Element {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <NetworkSummary />
    </Suspense>
  );
} 
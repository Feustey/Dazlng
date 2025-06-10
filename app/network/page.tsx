import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Réseau Lightning | DazNode - Explorer le Réseau Bitcoin',
  description: 'Explorez le réseau Lightning Network en temps réel. Découvrez les statistiques des nœuds, canaux, capacité et performances du réseau Bitcoin avec DazNode.',
  keywords: ['réseau Lightning Network', 'explorer Bitcoin', 'statistiques Lightning', 'nœuds Bitcoin', 'canaux Lightning', 'capacité réseau'],
  openGraph: {
    title: 'Explorer le Réseau Lightning | DazNode',
    description: 'Découvrez les statistiques en temps réel du réseau Lightning Network : nœuds, canaux, capacité et performances.',
    url: 'https://dazno.de/network',
    images: [
      {
        url: 'https://dazno.de/assets/images/network-og.png',
        width: 1200,
        height: 630,
        alt: 'Réseau Lightning Network'
      }
    ]
  },
  alternates: {
    canonical: 'https://dazno.de/network'
  }
};

export const dynamic = 'force-dynamic';
import { MCPClient } from '@/lib/mcp-client';

export default async function Page(): Promise<JSX.Element> {
  const client = MCPClient.getInstance();
  const summary = await client.getNetworkSummary();
  
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Résumé du Réseau</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(summary, null, 2)}
      </pre>
    </div>
  );
} 
import NetworkExplorer from '@/components/lightning/NetworkExplorer'
import NetworkRankings from '@/components/lightning/NetworkRankings'
import LightningCalculator from '@/components/lightning/LightningCalculator'

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Explorateur du Réseau Lightning | DazNode',
  description: 'Explorez le réseau Lightning Network, trouvez des nœuds et analysez leurs performances.',
};

export default function ExplorerPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Explorateur du Réseau Lightning</h1>
      
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <NetworkExplorer />
        </div>
        <NetworkRankings />
        <LightningCalculator />
      </div>
    </div>
  );
}

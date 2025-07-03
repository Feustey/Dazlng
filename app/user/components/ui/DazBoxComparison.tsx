import React from 'react';
import Link from 'next/link';

export interface NodeStats {
  monthlyRevenue: number;
  totalCapacity: number;
  activeChannels: number;
  uptime: number;
  healthScore: number;
  routingEfficiency: number;
  revenueGrowth: number;
  rankInNetwork: number;
  totalNodes: number;
}

export interface DazBoxComparisonProps {
  userNodeStats: NodeStats | null;
  hasNode: boolean;
}

const DazBoxComparison: React.FC<DazBoxComparisonProps> = ({ userNodeStats, hasNode }) => {
  const dazboxStats: NodeStats = {
    monthlyRevenue: 35000,
    totalCapacity: 5000000,
    uptime: 99.9,
    activeChannels: 15,
    healthScore: 92,
    routingEfficiency: 88,
    revenueGrowth: 25,
    rankInNetwork: 150,
    totalNodes: 20000
  };

  const calculateROI = (): { months: number; dailyRevenue: number } => {
    const dazboxPrice = 599; // Prix en euros
    const btcPrice = 45000; // Prix BTC approximatif
    const dailyRevenueBTC = (dazboxStats.monthlyRevenue / 30) / 100000000; // en BTC
    const dailyRevenueEUR = dailyRevenueBTC * btcPrice;
    const months = Math.ceil(dazboxPrice / (dailyRevenueEUR * 30));
    
    return {
      months,
      dailyRevenue: dailyRevenueEUR
    };
  };

  const roi = calculateROI();

  const formatSats = (sats: number): string => {
    return sats.toLocaleString('fr-FR');
  };

  const getImprovementPercentage = (userValue: number, dazboxValue: number): number => {
    if (userValue === 0) return 100;
    return Math.round(((dazboxValue - userValue) / userValue) * 100);
  };

  if (!hasNode) {
    return (
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Badge urgence */}
        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold animate-pulse">
          🔥 OFFRE LIMITÉE
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">🚀 Découvrez DazBox</h2>
            <p className="text-purple-100 mb-2">
              Le nœud Lightning clé en main pour générer des revenus passifs
            </p>
            <div className="flex items-center gap-2 text-sm text-yellow-300">
              <span>⭐</span>
              <span>Livraison en 48h • Installation incluse • Support 24/7</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{formatSats(dazboxStats.monthlyRevenue)}</div>
            <div className="text-sm text-purple-200">sats/mois en moyenne</div>
            <div className="text-xs text-yellow-300 mt-1">
              +{Math.round(dazboxStats.revenueGrowth)}% vs nœuds traditionnels
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl mb-2">⚡</div>
            <div className="text-xl font-bold">{(dazboxStats.totalCapacity / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-purple-200">Capacité sats</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl mb-2">⏱️</div>
            <div className="text-xl font-bold">{dazboxStats.uptime}%</div>
            <div className="text-sm text-purple-200">Uptime garanti</div>
          </div>
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <div className="text-2xl mb-2">📈</div>
            <div className="text-xl font-bold">{roi.months} mois</div>
            <div className="text-sm text-purple-200">ROI estimé</div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-6 mb-6 backdrop-blur-sm">
          <h3 className="font-semibold text-lg mb-4">💰 Rentabilité prévisionnelle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-purple-200 mb-1">Revenus mensuels moyens</div>
              <div className="text-2xl font-bold">{formatSats(dazboxStats.monthlyRevenue)} sats</div>
              <div className="text-sm text-purple-200">≈ {(roi.dailyRevenue * 30).toFixed(0)}Sats/mois</div>
            </div>
            <div>
              <div className="text-sm text-purple-200 mb-1">Retour sur investissement</div>
              <div className="text-2xl font-bold">{roi.months} mois</div>
              <div className="text-sm text-purple-200">Puis revenus passifs</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/dazbox" 
            className="flex-1 bg-white text-purple-600 py-3 px-6 rounded-lg font-semibold text-center hover:bg-gray-100 transition"
          >
            Découvrir DazBox
          </Link>
          <Link 
            href="/checkout/dazbox" 
            className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold text-center hover:from-yellow-500 hover:to-orange-600 transition"
          >
            Commander maintenant
          </Link>
        </div>
      </div>
  );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">📊 Comparaison avec DazBox</h2>
        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
          Analyse comparative
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">Votre nœud actuel</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Revenus mensuels</span>
              <span className="font-semibold">{userNodeStats ? formatSats(userNodeStats.monthlyRevenue) : '0'} sats</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Capacité</span>
              <span className="font-semibold">{userNodeStats ? (userNodeStats.totalCapacity / 1000000).toFixed(1) : '0'}M sats</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Uptime</span>
              <span className="font-semibold">{userNodeStats?.uptime || 0}%</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-700">DazBox</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm text-green-600">Revenus mensuels</span>
              <div className="text-right">
                <span className="font-semibold text-green-700">{formatSats(dazboxStats.monthlyRevenue)} sats</span>
                {userNodeStats && userNodeStats.monthlyRevenue > 0 && (
                  <div className="text-xs text-green-600">
                    +{getImprovementPercentage(userNodeStats.monthlyRevenue, dazboxStats.monthlyRevenue)}%
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm text-green-600">Capacité</span>
              <div className="text-right">
                <span className="font-semibold text-green-700">{(dazboxStats.totalCapacity / 1000000).toFixed(1)}M sats</span>
                {userNodeStats && userNodeStats.totalCapacity > 0 && (
                  <div className="text-xs text-green-600">
                    +{getImprovementPercentage(userNodeStats.totalCapacity, dazboxStats.totalCapacity)}%
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm text-green-600">Uptime</span>
              <span className="font-semibold text-green-700">{dazboxStats.uptime}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-purple-800 mb-3">💡 Potentiel d'amélioration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-purple-600 mb-1">Revenus supplémentaires/mois</div>
            <div className="text-2xl font-bold text-purple-700">
              +{formatSats(dazboxStats.monthlyRevenue - (userNodeStats?.monthlyRevenue || 0))} sats
            </div>
          </div>
          <div>
            <div className="text-sm text-purple-600 mb-1">ROI DazBox</div>
            <div className="text-2xl font-bold text-purple-700">{roi.months} mois</div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/dazbox" 
          className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:bg-purple-700 transition"
        >
          En savoir plus sur DazBox
        </Link>
        <Link 
          href="/checkout/dazbox" 
          className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 px-6 rounded-lg font-semibold text-center hover:from-yellow-500 hover:to-orange-600 transition"
        >
          Upgrader maintenant
        </Link>
      </div>
    </div>
  );
};

export { DazBoxComparison }; export const dynamic = "force-dynamic";

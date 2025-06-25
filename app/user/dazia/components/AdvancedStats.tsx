import { motion } from 'framer-motion';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export interface AdvancedStatsProps {
  stats: {
  channelDistribution: {
  labels: string[];
  data: number[];
  );
    revenueByCategory: {
      labels: string[];
      data: number[];
    };
    networkMetrics: {
      centrality: number;
      betweenness: number;
      eigenvector: number;
    };
    feeMetrics: {
      baseFee: number;
      feeRate: number;
      htlcFee: number;
    };
  };
}

export const AdvancedStats = ({ stats }: AdvancedStatsProps) => {
  const channelData = {
    labels: stats.channelDistribution.labels,
    datasets: [
      {
        label: 'Distribution des canaux',
        data: stats.channelDistribution.data,
        backgroundColor: 'rgba(234, 179, 8, 0.5)',
        borderColor: 'rgb(234, 179, 8)',
        borderWidth: 1,
      },
    ],
  };

  const revenueData = {
    labels: stats.revenueByCategory.labels,
    datasets: [
      {
        label: 'Revenus par catégorie',
        data: stats.revenueByCategory.data,
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Métriques de centralité */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900">Centralité</h3>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Centralité</span>
                <span className="text-lg font-semibold text-gray-900">
                  {stats.networkMetrics.centrality.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.networkMetrics.centrality * 100}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Betweenness</span>
                <span className="text-lg font-semibold text-gray-900">
                  {stats.networkMetrics.betweenness.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.networkMetrics.betweenness * 100}%` }}
                  className="h-full bg-green-500"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Eigenvector</span>
                <span className="text-lg font-semibold text-gray-900">
                  {stats.networkMetrics.eigenvector.toFixed(2)}
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.networkMetrics.eigenvector * 100}%` }}
                  className="h-full bg-purple-500"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Métriques de frais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900">Configuration des frais</h3>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Base Fee</span>
                <span className="text-lg font-semibold text-gray-900">
                  {stats.feeMetrics.baseFee} sats
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.feeMetrics.baseFee / 1000) * 100}%` }}
                  className="h-full bg-yellow-500"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Fee Rate</span>
                <span className="text-lg font-semibold text-gray-900">
                  {stats.feeMetrics.feeRate} ppm
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.feeMetrics.feeRate / 1000) * 100}%` }}
                  className="h-full bg-red-500"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">HTLC Fee</span>
                <span className="text-lg font-semibold text-gray-900">
                  {stats.feeMetrics.htlcFee} sats
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.feeMetrics.htlcFee / 1000) * 100}%` }}
                  className="h-full bg-indigo-500"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Graphiques */}
      <div className="grid gap-6 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Distribution des canaux
          </h3>
          <div className="mt-4 h-80">
            <Bar data={channelData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-900">
            Revenus par catégorie
          </h3>
          <div className="mt-4 h-80">
            <Bar data={revenueData} options={chartOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

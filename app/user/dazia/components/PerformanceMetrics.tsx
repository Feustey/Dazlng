import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Zap, Users } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
};
export interface MetricCardProps {
  title: string;
  value: number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const MetricCard = ({ title, value, change, icon, color }: MetricCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="mt-2 text-3xl font-bold text-gray-900">
          {value.toLocaleString()}
        </p>
      </div>
      <div className={`rounded-full p-3 ${color}`}>{icon}</div>
    </div>
    <div className="mt-4 flex items-center">
      <TrendingUp
        className={`h-4 w-4 ${
          change >= 0 ? 'text-green-500' : 'text-red-500'
        }`}
      />
      <span
        className={`ml-2 text-sm font-medium ${
          change >= 0 ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {change >= 0 ? '+' : ''}
        {change}%
      </span>
    </div>
  </motion.div>
};
export interface PerformanceMetricsProps {
  metrics: {
  revenue: {
  current: number;
  change: number;
  history: { date: string; value: number
}[];
    };
    efficiency: {
      current: number;
      change: number;
      history: { date: string; value: number }[];
    };
    channels: {
      current: number;
      change: number;
      history: { date: string; value: number }[];
    };
    uptime: {
      current: number;
      change: number;
      history: { date: string; value: number }[];
    };
  };
}

export const PerformanceMetrics = ({ metrics }: PerformanceMetricsProps) => {
  const chartData = {
    labels: metrics.revenue.history.map((h: any) => h.date),
    datasets: [
      {
        label: 'Revenus (sats)',
        data: metrics.revenue.history.map((h: any) => h.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Efficacité (%)',
        data: metrics.efficiency.history.map((h: any) => h.value),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Revenus 7j"
          value={metrics.revenue.current}
          change={metrics.revenue.change}
          icon={<Zap className="h-6 w-6 text-blue-500" />}
          color="bg-blue-50"
        />
        <MetricCard
          title="Efficacité"
          value={metrics.efficiency.current}
          change={metrics.efficiency.change}
          icon={<Activity className="h-6 w-6 text-green-500" />}
          color="bg-green-50"
        />
        <MetricCard
          title="Canaux"
          value={metrics.channels.current}
          change={metrics.channels.change}
          icon={<Users className="h-6 w-6 text-purple-500" />}
          color="bg-purple-50"
        />
        <MetricCard
          title="Uptime"
          value={metrics.uptime.current}
          change={metrics.uptime.change}
          icon={<Activity className="h-6 w-6 text-yellow-500" />}
          color="bg-yellow-50"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900">
          Évolution des performances
        </h3>
        <div className="mt-4 h-80">
          <Line data={chartData} options={chartOptions} />
        </div>
      </motion.div>
    </div>
};
}

"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
  ScaleOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartProps {
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      tension?: number;
      tooltipFormat?: (value: number) => string;
    }[];
  };
}

export function Chart({ data }: ChartProps) {
  const xAxisOptions: ScaleOptions<'category'> = {
    grid: {
      display: false,
    },
    ticks: {
      maxRotation: 45,
      minRotation: 45,
      font: {
        size: 12,
      },
      color: 'hsl(var(--muted-foreground))',
    },
    border: {
      color: 'hsl(var(--border))',
    },
  };

  const yAxisOptions: ScaleOptions<'linear'> = {
    beginAtZero: true,
    grid: {
      color: 'hsl(var(--border))',
    },
    ticks: {
      font: {
        size: 12,
      },
      color: 'hsl(var(--muted-foreground))',
      callback: function(tickValue: number | string) {
        const value = Number(tickValue);
        const dataset = data.datasets[0];
        return dataset.tooltipFormat ? dataset.tooltipFormat(value) : value.toString();
      },
    },
    border: {
      color: 'hsl(var(--border))',
    },
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'hsl(var(--card))',
        titleColor: 'hsl(var(--card-foreground))',
        bodyColor: 'hsl(var(--card-foreground))',
        borderColor: 'hsl(var(--border))',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            const dataset = data.datasets[context.datasetIndex];
            return dataset.tooltipFormat ? dataset.tooltipFormat(value) : value.toString();
          },
        },
      },
    },
    scales: {
      x: xAxisOptions,
      y: yAxisOptions,
    },
  };

  return (
    <div className="h-[300px] w-full">
      <Line data={data} options={options} />
    </div>
  );
}
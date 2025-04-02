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
} from "chart.js";
import { Line } from "react-chartjs-2";
import { ReactNode } from "react";

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
  title?: string;
  description?: string;
  height?: number;
  children?: ReactNode;
  data?: ChartData<"line">;
  options?: ChartOptions<"line">;
}

export function Chart({
  title,
  description,
  height,
  children,
  data,
  options,
}: ChartProps) {
  const defaultOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          font: {
            size: 12,
          },
          color: "hsl(var(--muted-foreground))",
        },
        border: {
          color: "hsl(var(--border))",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "hsl(var(--border))",
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "hsl(var(--muted-foreground))",
        },
        border: {
          color: "hsl(var(--border))",
        },
      },
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  return (
    <div className="w-full" style={{ height: height || 400 }}>
      {data && <Line data={data} options={mergedOptions} />}
      {children}
    </div>
  );
}

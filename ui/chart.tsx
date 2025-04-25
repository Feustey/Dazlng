"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ReactNode } from "react";
import { useTheme } from "next-themes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type ChartType = "line" | "bar" | "pie";
type ChartLibrary = "chartjs" | "nivo";

interface BaseChartProps {
  /** Titre du graphique */
  title?: string;
  /** Description du graphique */
  description?: string;
  /** Hauteur du conteneur en pixels */
  height?: number;
  /** Contenu additionnel à afficher sous le graphique */
  children?: ReactNode;
  /** Type de graphique */
  type?: ChartType;
  /** Bibliothèque à utiliser */
  library?: ChartLibrary;
  /** Classe CSS personnalisée */
  className?: string;
}

interface ChartJSProps extends BaseChartProps {
  /** Données pour Chart.js */
  data: ChartData<"line" | "bar" | "pie">;
  /** Options personnalisées pour Chart.js */
  options?: Partial<ChartOptions<"line" | "bar" | "pie">>;
}

interface NivoLineData {
  id: string;
  data: Array<{
    x: string | number;
    y: string | number;
  }>;
}

interface NivoBarData {
  indexBy: string;
  keys: string[];
  data: Array<{
    [key: string]: string | number;
  }>;
}

interface NivoPieData {
  id: string;
  value: number;
  label?: string;
}

type NivoData = NivoLineData[] | NivoBarData | NivoPieData[];

interface NivoProps extends BaseChartProps {
  /** Données pour Nivo */
  data: NivoData;
  /** Configuration personnalisée pour Nivo */
  nivoConfig?: any;
}

type ChartProps = ChartJSProps | NivoProps;

export function Chart({
  title,
  description,
  height = 400,
  children,
  type = "line",
  library = "chartjs",
  className = "",
  ...props
}: ChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const defaultChartJSOptions: Partial<ChartOptions<"line" | "bar" | "pie">> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          color: isDark
            ? "hsl(var(--muted-foreground))"
            : "hsl(var(--foreground))",
        },
      },
      title: {
        display: !!title,
        text: title,
        color: isDark
          ? "hsl(var(--muted-foreground))"
          : "hsl(var(--foreground))",
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
          color: isDark
            ? "hsl(var(--muted-foreground))"
            : "hsl(var(--foreground))",
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
          color: isDark
            ? "hsl(var(--muted-foreground))"
            : "hsl(var(--foreground))",
        },
        border: {
          color: "hsl(var(--border))",
        },
      },
    },
  };

  const defaultNivoConfig = {
    margin: { top: 50, right: 110, bottom: 50, left: 60 },
    theme: {
      text: {
        fill: isDark
          ? "hsl(var(--muted-foreground))"
          : "hsl(var(--foreground))",
      },
      grid: {
        line: {
          stroke: "hsl(var(--border))",
        },
      },
    },
    colors: { scheme: "nivo" },
    enableGridX: false,
    enableGridY: true,
    axisBottom: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: title,
      legendOffset: 36,
      legendPosition: "middle",
    },
    axisLeft: {
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legendOffset: -40,
      legendPosition: "middle",
    },
    pointSize: 10,
    pointColor: { theme: "background" },
    pointBorderWidth: 2,
    pointBorderColor: { from: "serieColor" },
    pointLabelYOffset: -12,
    useMesh: true,
    legends: [
      {
        anchor: "bottom-right",
        direction: "column",
        justify: false,
        translateX: 100,
        translateY: 0,
        itemsSpacing: 0,
        itemDirection: "left-to-right",
        itemWidth: 80,
        itemHeight: 20,
        itemOpacity: 0.75,
        symbolSize: 12,
        symbolShape: "circle",
        symbolBorderColor: "rgba(0, 0, 0, .5)",
        effects: [
          {
            on: "hover",
            style: {
              itemBackground: "rgba(0, 0, 0, .03)",
              itemOpacity: 1,
            },
          },
        ],
      },
    ],
  };

  const renderChart = () => {
    if (library === "chartjs" && "options" in props) {
      const mergedOptions = {
        ...defaultChartJSOptions,
        ...props.options,
      };

      switch (type) {
        case "line":
          return (
            <Line
              data={props.data as ChartData<"line">}
              options={mergedOptions as ChartOptions<"line">}
            />
          );
        case "bar":
          return (
            <Bar
              data={props.data as ChartData<"bar">}
              options={mergedOptions as ChartOptions<"bar">}
            />
          );
        case "pie":
          return (
            <Pie
              data={props.data as ChartData<"pie">}
              options={mergedOptions as ChartOptions<"pie">}
            />
          );
        default:
          return null;
      }
    }

    if (library === "nivo" && "nivoConfig" in props) {
      const mergedConfig = {
        ...defaultNivoConfig,
        ...props.nivoConfig,
      };

      switch (type) {
        case "line":
          return (
            <ResponsiveLine
              data={props.data as NivoLineData[]}
              {...mergedConfig}
            />
          );
        case "bar":
          return (
            <ResponsiveBar data={props.data as NivoBarData} {...mergedConfig} />
          );
        case "pie":
          return (
            <ResponsivePie
              data={props.data as NivoPieData[]}
              {...mergedConfig}
            />
          );
        default:
          return null;
      }
    }

    return null;
  };

  return (
    <div className={`w-full ${className}`} style={{ height }}>
      {renderChart()}
      {children}
    </div>
  );
}

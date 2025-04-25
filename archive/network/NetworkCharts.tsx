import Card from "./ui/card";
import { Node } from "../types/network";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie, Line, Scatter } from "react-chartjs-2";
import { useTranslations } from "next-intl";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface NetworkChartsProps {
  nodes: Node[];
}

export function NetworkCharts({ nodes }: NetworkChartsProps) {
  const t = useTranslations("pages.network.charts");

  // Préparation des données pour le graphique de capacité
  const capacityData = {
    labels: nodes.map((node) => node.name),
    datasets: [
      {
        label: t("capacity.label"),
        data: nodes.map((node) => parseFloat(node.capacity.toString())),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  // Préparation des données pour le graphique de statut
  const statusData = {
    labels: [t("status.active"), t("status.inactive")],
    datasets: [
      {
        data: [
          nodes.filter((node) => node.status === "active").length,
          nodes.filter((node) => node.status === "inactive").length,
        ],
        backgroundColor: ["rgba(75, 192, 192, 0.5)", "rgba(255, 99, 132, 0.5)"],
      },
    ],
  };

  // Préparation des données pour l'évolution de la capacité
  const capacityEvolutionData = {
    labels: [
      t("months.jan"),
      t("months.feb"),
      t("months.mar"),
      t("months.apr"),
      t("months.may"),
      t("months.jun"),
      t("months.jul"),
      t("months.aug"),
      t("months.sep"),
      t("months.oct"),
      t("months.nov"),
      t("months.dec"),
    ],
    datasets: [
      {
        label: t("capacityEvolution.label"),
        data: [120, 150, 180, 220, 250, 280, 300, 320, 350, 380, 400, 420],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Préparation des données pour la distribution des âges
  const ageDistributionData = {
    labels: [
      t("ageDistribution.lessThanMonth"),
      t("ageDistribution.oneToThreeMonths"),
      t("ageDistribution.threeToSixMonths"),
      t("ageDistribution.sixToTwelveMonths"),
      t("ageDistribution.moreThanYear"),
    ],
    datasets: [
      {
        label: t("ageDistribution.label"),
        data: [
          nodes.filter((node) => node.age < 1).length,
          nodes.filter((node) => node.age >= 1 && node.age < 3).length,
          nodes.filter((node) => node.age >= 3 && node.age < 6).length,
          nodes.filter((node) => node.age >= 6 && node.age < 12).length,
          nodes.filter((node) => node.age >= 12).length,
        ],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  // Préparation des données pour la corrélation capacité/canaux
  const correlationData = {
    datasets: [
      {
        label: t("correlation.label"),
        data: nodes.map((node) => ({
          x: parseFloat(node.capacity.toString()),
          y: node.channels.length,
        })),
        backgroundColor: "rgba(255, 159, 64, 0.5)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  const scatterOptions = {
    ...options,
    scales: {
      x: {
        title: {
          display: true,
          text: t("correlation.xAxis"),
        },
      },
      y: {
        title: {
          display: true,
          text: t("correlation.yAxis"),
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">{t("capacity.title")}</h3>
        <Bar data={capacityData} options={options} />
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">{t("status.title")}</h3>
        <Pie data={statusData} options={options} />
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {t("capacityEvolution.title")}
        </h3>
        <Line data={capacityEvolutionData} options={options} />
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          {t("ageDistribution.title")}
        </h3>
        <Bar data={ageDistributionData} options={options} />
      </Card>
      <Card className="p-4 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">{t("correlation.title")}</h3>
        <Scatter data={correlationData} options={scatterOptions} />
      </Card>
    </div>
  );
}

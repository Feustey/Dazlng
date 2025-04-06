import { Card } from "@/app/components/ui/card";
import { Node } from "@/app/types/network";
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
  // Préparation des données pour le graphique de capacité
  const capacityData = {
    labels: nodes.map((node) => node.name),
    datasets: [
      {
        label: "Capacité (BTC)",
        data: nodes.map((node) => parseFloat(node.capacity)),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  // Préparation des données pour le graphique de statut
  const statusData = {
    labels: ["Actif", "Inactif"],
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
      "Jan",
      "Fév",
      "Mar",
      "Avr",
      "Mai",
      "Juin",
      "Juil",
      "Aoû",
      "Sep",
      "Oct",
      "Nov",
      "Déc",
    ],
    datasets: [
      {
        label: "Capacité totale (BTC)",
        data: [120, 150, 180, 220, 250, 280, 300, 320, 350, 380, 400, 420], // À remplacer par les vraies données
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // Préparation des données pour la distribution des âges
  const ageDistributionData = {
    labels: ["< 1 mois", "1-3 mois", "3-6 mois", "6-12 mois", "> 1 an"],
    datasets: [
      {
        label: "Nombre de nœuds",
        data: [
          nodes.filter((node) => parseInt(node.age) < 1).length,
          nodes.filter(
            (node) => parseInt(node.age) >= 1 && parseInt(node.age) < 3
          ).length,
          nodes.filter(
            (node) => parseInt(node.age) >= 3 && parseInt(node.age) < 6
          ).length,
          nodes.filter(
            (node) => parseInt(node.age) >= 6 && parseInt(node.age) < 12
          ).length,
          nodes.filter((node) => parseInt(node.age) >= 12).length,
        ],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  // Préparation des données pour la corrélation capacité/canaux
  const correlationData = {
    datasets: [
      {
        label: "Nœuds",
        data: nodes.map((node) => ({
          x: parseFloat(node.capacity),
          y: node.channels,
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
          text: "Capacité (BTC)",
        },
      },
      y: {
        title: {
          display: true,
          text: "Nombre de canaux",
        },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Capacité par nœud</h3>
        <Bar data={capacityData} options={options} />
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">Répartition des statuts</h3>
        <Pie data={statusData} options={options} />
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Évolution de la capacité du réseau
        </h3>
        <Line data={capacityEvolutionData} options={options} />
      </Card>
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-4">
          Distribution des âges des nœuds
        </h3>
        <Bar data={ageDistributionData} options={options} />
      </Card>
      <Card className="p-4 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">
          Corrélation Capacité / Nombre de canaux
        </h3>
        <Scatter data={correlationData} options={scatterOptions} />
      </Card>
    </div>
  );
}

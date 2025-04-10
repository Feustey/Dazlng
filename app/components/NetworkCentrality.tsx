import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Centralities } from "../types/node";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface NetworkCentralityProps {
  centralityData: Centralities;
}

export function NetworkCentrality({ centralityData }: NetworkCentralityProps) {
  // Préparation des données pour les graphiques de centralité
  const betweennessData = {
    labels: centralityData.betweenness.slice(0, 10).map((node) => node.pubkey),
    datasets: [
      {
        label: "Centralité d'intermédiarité",
        data: centralityData.betweenness.slice(0, 10).map((node) => node.value),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const eigenvectorData = {
    labels: centralityData.eigenvector.slice(0, 10).map((node) => node.pubkey),
    datasets: [
      {
        label: "Centralité de vecteur propre",
        data: centralityData.eigenvector.slice(0, 10).map((node) => node.value),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  const closenessData = {
    labels: centralityData.closeness.slice(0, 10).map((node) => node.pubkey),
    datasets: [
      {
        label: "Centralité de proximité",
        data: centralityData.closeness.slice(0, 10).map((node) => node.value),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };

  const weightedBetweennessData = {
    labels: centralityData.weighted_betweenness
      .slice(0, 10)
      .map((node) => node.pubkey),
    datasets: [
      {
        label: "Centralité d'intermédiarité pondérée",
        data: centralityData.weighted_betweenness
          .slice(0, 10)
          .map((node) => node.value),
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
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            return `Valeur: ${value.toFixed(4)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analyse de centralité du réseau</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              Centralité d'intermédiarité (Betweenness)
            </CardTitle>
            <div className="h-[250px]">
              <Bar data={betweennessData} options={options} />
            </div>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              Centralité de proximité (Closeness)
            </CardTitle>
            <div className="h-[250px]">
              <Bar data={closenessData} options={options} />
            </div>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              Centralité de vecteur propre (Eigenvector)
            </CardTitle>
            <div className="h-[250px]">
              <Bar data={eigenvectorData} options={options} />
            </div>
          </Card>
          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              Centralité d'intermédiarité pondérée
            </CardTitle>
            <div className="h-[250px]">
              <Bar data={weightedBetweennessData} options={options} />
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { NetworkChannel } from "../types/network";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface NetworkChannelsProps {
  recentChannels: NetworkChannel[];
}

export function NetworkChannels({ recentChannels }: NetworkChannelsProps) {
  // Préparation des données pour la distribution des capacités
  const capacityRanges = [
    { min: 0, max: 0.1, label: "< 0.1 BTC" },
    { min: 0.1, max: 1, label: "0.1 - 1 BTC" },
    { min: 1, max: 10, label: "1 - 10 BTC" },
    { min: 10, max: 100, label: "10 - 100 BTC" },
    { min: 100, max: Infinity, label: "> 100 BTC" },
  ];

  const capacityDistribution = capacityRanges.map((range) => ({
    label: range.label,
    count: recentChannels.filter(
      (channel) =>
        channel.capacity / 100000000 >= range.min &&
        channel.capacity / 100000000 < range.max
    ).length,
  }));

  const capacityData = {
    labels: capacityDistribution.map((item) => item.label),
    datasets: [
      {
        label: "Nombre de canaux",
        data: capacityDistribution.map((item) => item.count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
      },
    ],
  };

  // Préparation des données pour la distribution des statuts
  const statusData = {
    labels: ["Actif", "Inactif", "Fermé"],
    datasets: [
      {
        data: [
          recentChannels.filter((c) => c.status === "active").length,
          recentChannels.filter((c) => c.status === "inactive").length,
          recentChannels.filter((c) => c.status === "closed").length,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité des canaux</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              Canaux récemment ouverts
            </CardTitle>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {recentChannels
                .filter((channel) => channel.status === "active")
                .slice(0, 10)
                .map((channel) => (
                  <div
                    key={channel.channelId}
                    className="flex justify-between items-center p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {channel.node1Pub.substring(0, 8)}... →{" "}
                        {channel.node2Pub.substring(0, 8)}...
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {(channel.capacity / 100000000).toFixed(2)} BTC
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(channel.lastUpdate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
            </div>
          </Card>

          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              Distribution des capacités
            </CardTitle>
            <div className="h-[300px]">
              <Bar data={capacityData} options={options} />
            </div>
          </Card>

          <Card className="p-4 md:col-span-2">
            <CardTitle className="text-base mb-2">État des canaux</CardTitle>
            <div className="h-[300px]">
              <Pie data={statusData} options={options} />
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

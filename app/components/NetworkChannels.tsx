import Card from "./ui/card";
import { CardContent, CardHeader, CardTitle } from "./ui/card";
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
import { useTranslations } from "next-intl";
import { formatSats } from "../utils/format";

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
  const t = useTranslations("pages.network.channels");

  // Préparation des données pour les graphiques
  const capacityData = {
    labels: recentChannels
      .filter((channel) => channel.status === "active")
      .slice(0, 10)
      .map(
        (channel) =>
          `${channel.node1Pub.substring(0, 8)}... → ${channel.node2Pub.substring(0, 8)}...`
      ),
    datasets: [
      {
        label: t("capacity.label"),
        data: recentChannels
          .filter((channel) => channel.status === "active")
          .slice(0, 10)
          .map((channel) => channel.capacity),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const statusData = {
    labels: [t("status.active"), t("status.inactive"), t("status.closed")],
    datasets: [
      {
        data: [
          recentChannels.filter((channel) => channel.status === "active")
            .length,
          recentChannels.filter((channel) => channel.status === "inactive")
            .length,
          recentChannels.filter((channel) => channel.status === "closed")
            .length,
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
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.raw;
            return `${label}: ${value}`;
          },
        },
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <CardTitle className="text-base mb-2">
              {t("recentChannels.title")}
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
                        {formatSats(channel.capacity)}
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
              {t("capacityDistribution.title")}
            </CardTitle>
            <div className="h-[300px]">
              <Bar data={capacityData} options={options} />
            </div>
          </Card>

          <Card className="p-4 md:col-span-2">
            <CardTitle className="text-base mb-2">
              {t("statusDistribution.title")}
            </CardTitle>
            <div className="h-[300px]">
              <Pie data={statusData} options={options} />
            </div>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

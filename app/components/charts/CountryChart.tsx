import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTranslations } from "next-intl";

interface CountryChartProps {
  data: Record<string, number>;
}

export default function CountryChart({ data }: CountryChartProps) {
  const t = useTranslations("pages.network.charts.nodesByCountry");
  const chartData = Object.entries(data)
    .map(([country, count]) => ({
      country,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="country"
            label={{
              value: t("xAxisLabel"),
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            label={{
              value: t("yAxisLabel"),
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "var(--background)" }}
            labelStyle={{ color: "var(--foreground)" }}
            formatter={(value) => [value, t("tooltipValue")]}
            labelFormatter={(label) => `${t("tooltipLabel")}: ${label}`}
          />
          <Bar dataKey="count" fill="var(--blue-500)" name={t("barName")} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

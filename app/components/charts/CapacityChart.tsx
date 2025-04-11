import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatSats } from "../../utils/format";
import { useTranslations } from "next-intl";

interface CapacityChartProps {
  data: Array<{
    date: Date;
    value: number;
  }>;
}

export default function CapacityChart({ data }: CapacityChartProps) {
  const t = useTranslations("pages.network.charts.capacityHistory");

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            label={{
              value: t("xAxisLabel"),
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            tickFormatter={(value) => `${(value / 1000000000).toFixed(0)}B`}
            label={{
              value: t("yAxisLabel"),
              angle: -90,
              position: "insideLeft",
            }}
          />
          <Tooltip
            formatter={(value) => formatSats(Number(value))}
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            contentStyle={{ backgroundColor: "var(--background)" }}
            labelStyle={{ color: "var(--foreground)" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--orange-500)"
            strokeWidth={2}
            name={t("lineName")}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";
import { useTheme } from "next-themes";

interface LineChartProps {
  data: Array<{ date: string; value: number }>;
  xKey: string;
  yKey: string;
  height?: number;
}

interface PieChartProps {
  data: Array<{ country: string; count: number }>;
  nameKey: string;
  valueKey: string;
  height?: number;
}

const commonTheme = {
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
};

export function LineChart({ data, xKey, yKey, height = 400 }: LineChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formattedData = [
    {
      id: "capacity",
      data: data.map((item) => ({
        x: item.date,
        y: item.value,
      })),
    },
  ];

  return (
    <div style={{ height }}>
      <ResponsiveLine
        data={formattedData}
        margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
        xScale={{ type: "point" }}
        yScale={{
          type: "linear",
          min: "auto",
          max: "auto",
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        enablePoints={true}
        pointSize={8}
        pointColor={{ theme: "background" }}
        pointBorderWidth={2}
        pointBorderColor={{ from: "serieColor" }}
        enableGridX={false}
        colors={["#3b82f6"]}
        theme={{
          ...commonTheme,
          text: {
            fill: isDark ? "#e5e7eb" : "#374151",
          },
          grid: {
            line: {
              stroke: isDark ? "#374151" : "#e5e7eb",
            },
          },
        }}
      />
    </div>
  );
}

export function PieChart({
  data,
  nameKey,
  valueKey,
  height = 400,
}: PieChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const formattedData = data.map((item) => ({
    id: item[nameKey],
    label: item[nameKey],
    value: item[valueKey],
  }));

  return (
    <div style={{ height }}>
      <ResponsivePie
        data={formattedData}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        innerRadius={0.5}
        padAngle={0.7}
        cornerRadius={3}
        activeOuterRadiusOffset={8}
        borderWidth={1}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.2]],
        }}
        arcLinkLabelsSkipAngle={10}
        arcLinkLabelsTextColor={isDark ? "#e5e7eb" : "#374151"}
        arcLinkLabelsThickness={2}
        arcLinkLabelsColor={{ from: "color" }}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{
          from: "color",
          modifiers: [["darker", 2]],
        }}
        theme={{
          ...commonTheme,
          text: {
            fill: isDark ? "#e5e7eb" : "#374151",
          },
        }}
      />
    </div>
  );
}

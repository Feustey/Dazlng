import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatSats } from "@/app/utils/format";

interface CapacityChartProps {
  data: Array<{
    date: Date;
    value: number;
  }>;
}

export default function CapacityChart({ data }: CapacityChartProps) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis
            tickFormatter={(value) => `${(value / 1000000000).toFixed(0)}B`}
          />
          <Tooltip
            formatter={(value) => formatSats(Number(value))}
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--orange-500)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

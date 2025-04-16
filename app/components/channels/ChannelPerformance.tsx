import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Jan", capacity: 4.2, fees: 0.12 },
  { name: "Fév", capacity: 4.8, fees: 0.15 },
  { name: "Mar", capacity: 5.1, fees: 0.18 },
  { name: "Avr", capacity: 5.5, fees: 0.22 },
  { name: "Mai", capacity: 6.2, fees: 0.25 },
  { name: "Juin", capacity: 7.1, fees: 0.28 },
  { name: "Juil", capacity: 8.3, fees: 0.32 },
  { name: "Aoû", capacity: 9.5, fees: 0.35 },
  { name: "Sep", capacity: 10.2, fees: 0.38 },
  { name: "Oct", capacity: 11.4, fees: 0.42 },
  { name: "Nov", capacity: 12.1, fees: 0.45 },
  { name: "Déc", capacity: 12.5, fees: 0.48 },
];

export default function ChannelPerformance() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle>Performance des Canaux</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-sm text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis
                  yAxisId="left"
                  className="text-sm text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  className="text-sm text-muted-foreground"
                  tick={{ fill: "currentColor" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="capacity"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  name="Capacité (BTC)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="fees"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={2}
                  dot={false}
                  name="Frais (BTC)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

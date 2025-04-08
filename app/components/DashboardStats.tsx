import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Activity,
  Zap,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, icon }: StatCardProps) => (
  <Card className="backdrop-blur-sm bg-card/80 hover:bg-card/90 transition-all duration-300">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <div className="flex items-center text-sm">
        {change >= 0 ? (
          <ArrowUpRight className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-destructive" />
        )}
        <span className={change >= 0 ? "text-green-500" : "text-destructive"}>
          {Math.abs(change)}%
        </span>
        <span className="text-muted-foreground ml-1">
          depuis le mois dernier
        </span>
      </div>
    </CardContent>
  </Card>
);

export default function DashboardStats() {
  const stats = [
    {
      title: "Capacité Totale",
      value: "12.5 BTC",
      change: 15.3,
      icon: <Zap className="h-4 w-4 text-primary" />,
    },
    {
      title: "Canaux Actifs",
      value: "24",
      change: 8.2,
      icon: <Activity className="h-4 w-4 text-secondary" />,
    },
    {
      title: "Partners",
      value: "156",
      change: -2.1,
      icon: <Users className="h-4 w-4 text-accent" />,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <StatCard {...stat} />
        </motion.div>
      ))}
    </div>
  );
}

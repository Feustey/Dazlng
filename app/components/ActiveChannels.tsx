import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowDownRight,
  Settings,
  AlertCircle,
} from "lucide-react";

interface Channel {
  id: string;
  partner: string;
  capacity: number;
  localBalance: number;
  remoteBalance: number;
  status: "active" | "inactive" | "pending";
  uptime: number;
}

const channels: Channel[] = [
  {
    id: "1",
    partner: "ACINQ",
    capacity: 2.5,
    localBalance: 1.8,
    remoteBalance: 0.7,
    status: "active",
    uptime: 99.9,
  },
  {
    id: "2",
    partner: "Blockstream",
    capacity: 1.8,
    localBalance: 1.2,
    remoteBalance: 0.6,
    status: "active",
    uptime: 99.8,
  },
  {
    id: "3",
    partner: "Lightning Labs",
    capacity: 3.2,
    localBalance: 2.1,
    remoteBalance: 1.1,
    status: "active",
    uptime: 99.7,
  },
  {
    id: "4",
    partner: "Bitcoin Core",
    capacity: 1.5,
    localBalance: 0.9,
    remoteBalance: 0.6,
    status: "inactive",
    uptime: 0,
  },
];

const getStatusColor = (status: Channel["status"]) => {
  switch (status) {
    case "active":
      return "bg-green-500/10 text-green-500";
    case "inactive":
      return "bg-destructive/10 text-destructive";
    case "pending":
      return "bg-yellow-500/10 text-yellow-500";
  }
};

export default function ActiveChannels() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="backdrop-blur-sm bg-card/80">
        <CardHeader>
          <CardTitle>Canaux Actifs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{channel.partner}</h3>
                    <Badge
                      variant="secondary"
                      className={getStatusColor(channel.status)}
                    >
                      {channel.status === "active" ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Capacité: {channel.capacity} BTC
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {channel.localBalance} BTC
                    </div>
                    <div className="text-xs text-muted-foreground">Local</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {channel.remoteBalance} BTC
                    </div>
                    <div className="text-xs text-muted-foreground">Remote</div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <AlertCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

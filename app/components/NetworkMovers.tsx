import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, Network, Star } from "lucide-react";

interface MoverData {
  name: string;
  capacity: string;
  capacityChange: string;
  channels: string;
  channelsChange: string;
  percentageChange?: string;
}

const CapacityIncrease = () => {
  const movers: MoverData[] = [
    {
      name: "CoinGate",
      capacity: "+132.29 BTC",
      capacityChange: "57.5%",
      channels: "+196",
      channelsChange: "42.9%",
    },
    {
      name: "LOOP",
      capacity: "+49.64 BTC",
      capacityChange: "78.6%",
      channels: "+35",
      channelsChange: "70.0%",
    },
    {
      name: "Unknown",
      capacity: "+30 BTC",
      capacityChange: "100%",
      channels: "+60",
      channelsChange: "100%",
    },
  ];

  return (
    <div className="space-y-4">
      {movers.map((mover, index) => (
        <MoverCard key={index} data={mover} type="increase" />
      ))}
    </div>
  );
};

const CapacityDecrease = () => {
  const movers: MoverData[] = [
    {
      name: "CoinGate",
      capacity: "-138.21 BTC",
      capacityChange: "37.5%",
      channels: "-230",
      channelsChange: "33.5%",
    },
    {
      name: "LOOP",
      capacity: "-85.43 BTC",
      capacityChange: "25.6%",
      channels: "-120",
      channelsChange: "28.0%",
    },
  ];

  return (
    <div className="space-y-4">
      {movers.map((mover, index) => (
        <MoverCard key={index} data={mover} type="decrease" />
      ))}
    </div>
  );
};

const PopularNodes = () => {
  const nodes: MoverData[] = [
    {
      name: "WalletOfSatoshi.com",
      capacity: "175.97 BTC",
      channels: "1401",
      capacityChange: "",
      channelsChange: "",
    },
    {
      name: "ACINQ",
      capacity: "591.37 BTC",
      channels: "3421",
      capacityChange: "",
      channelsChange: "",
    },
    {
      name: "cyberdyne.sh",
      capacity: "89.05 BTC",
      channels: "217",
      capacityChange: "",
      channelsChange: "",
    },
  ];

  return (
    <div className="space-y-4">
      {nodes.map((node, index) => (
        <MoverCard key={index} data={node} type="popular" />
      ))}
    </div>
  );
};

interface MoverCardProps {
  data: MoverData;
  type: "increase" | "decrease" | "popular";
}

const MoverCard = ({ data, type }: MoverCardProps) => {
  const getIcon = () => {
    switch (type) {
      case "increase":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "decrease":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case "popular":
        return <Star className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getChangeColor = (change: string) => {
    if (!change) return "";
    return type === "increase" ? "text-green-500" : "text-destructive";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-card flex items-center justify-center">
            {getIcon()}
          </div>
          <h3 className="font-medium">{data.name}</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-muted-foreground">Capacité</div>
          <div className="font-medium flex items-center gap-1">
            {data.capacity}
            {data.capacityChange && (
              <span className={getChangeColor(data.capacityChange)}>
                ({data.capacityChange})
              </span>
            )}
          </div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Canaux</div>
          <div className="font-medium flex items-center gap-1">
            {data.channels}
            {data.channelsChange && (
              <span className={getChangeColor(data.channelsChange)}>
                ({data.channelsChange})
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function NetworkMovers() {
  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Mouvements du Réseau
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Quotidien</TabsTrigger>
            <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
            <TabsTrigger value="monthly">Mensuel</TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Augmentation de Capacité
              </h3>
              <CapacityIncrease />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-destructive" />
                Diminution de Capacité
              </h3>
              <CapacityDecrease />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Nœuds Populaires
              </h3>
              <PopularNodes />
            </div>
          </TabsContent>

          <TabsContent value="weekly">
            {/* Contenu similaire pour l'hebdomadaire */}
          </TabsContent>

          <TabsContent value="monthly">
            {/* Contenu similaire pour le mensuel */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

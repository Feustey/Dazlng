"use client";

import { Card } from "@/components/ui/card";
import { Clock, MapPin, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface GeneralInfo {
  lastUpdate: string;
  address: string;
  biggestChannel: number;
  smallestChannel: number;
  oldestChannel: number;
  youngestChannel: number;
}

interface NodeGeneralInfoProps {
  info: GeneralInfo;
}

export default function NodeGeneralInfo({ info }: NodeGeneralInfoProps) {
  const formatSats = (sats: number) => {
    if (sats >= 100000000) {
      return `${(sats / 100000000).toFixed(2)} BTC`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(0)}k sats`;
    }
    return `${sats} sats`;
  };

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">
              Dernière mise à jour
            </p>
            <p className="font-medium text-foreground">
              {new Date(info.lastUpdate).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="h-5 w-5 text-secondary" />
          <div>
            <p className="text-sm text-muted-foreground">Adresse</p>
            <p className="font-medium text-foreground break-all">
              {info.address}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ArrowUpRight className="h-5 w-5 text-accent" />
          <div>
            <p className="text-sm text-muted-foreground">Plus grand canal</p>
            <p className="font-medium text-foreground">
              {formatSats(info.biggestChannel)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <ArrowDownRight className="h-5 w-5 text-destructive" />
          <div>
            <p className="text-sm text-muted-foreground">Plus petit canal</p>
            <p className="font-medium text-foreground">
              {formatSats(info.smallestChannel)}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-primary" />
          <div>
            <p className="text-sm text-muted-foreground">
              Canal le plus ancien
            </p>
            <p className="font-medium text-foreground">
              {info.oldestChannel} mois
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Clock className="h-5 w-5 text-secondary" />
          <div>
            <p className="text-sm text-muted-foreground">
              Canal le plus récent
            </p>
            <p className="font-medium text-foreground">
              {info.youngestChannel} mois
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

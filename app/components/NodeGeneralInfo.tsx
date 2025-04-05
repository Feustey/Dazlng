"use client";

import { Card } from "@/app/components/ui/card";
import {
  Clock,
  Link,
  TrendingUp,
  TrendingDown,
  Calendar,
  CalendarDays,
} from "lucide-react";

interface GeneralInfo {
  lastUpdate: string;
  address: string;
  biggestChannel: number;
  smallestChannel: number;
  oldestChannel: string;
  youngestChannel: string;
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
      <h3 className="text-xl font-bold mb-6 text-gray-800">
        Informations Générales
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 text-blue-500 mr-2" />
            <h4 className="font-semibold text-gray-800">
              Dernière mise à jour
            </h4>
          </div>
          <div className="text-lg font-semibold text-blue-700">
            {info.lastUpdate}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Dernière actualisation des données
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="flex items-center mb-2">
            <Link className="h-5 w-5 text-purple-500 mr-2" />
            <h4 className="font-semibold text-gray-800">Adresse</h4>
          </div>
          <div className="text-sm font-mono break-all text-purple-700">
            {info.address}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Identifiant unique du nœud
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center mb-2">
            <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
            <h4 className="font-semibold text-gray-800">Plus grand canal</h4>
          </div>
          <div className="text-lg font-semibold text-green-700">
            {formatSats(info.biggestChannel)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Capacité maximale d'un canal
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <div className="flex items-center mb-2">
            <TrendingDown className="h-5 w-5 text-red-500 mr-2" />
            <h4 className="font-semibold text-gray-800">Plus petit canal</h4>
          </div>
          <div className="text-lg font-semibold text-red-700">
            {formatSats(info.smallestChannel)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Capacité minimale d'un canal
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <div className="flex items-center mb-2">
            <Calendar className="h-5 w-5 text-amber-500 mr-2" />
            <h4 className="font-semibold text-gray-800">
              Canal le plus ancien
            </h4>
          </div>
          <div className="text-lg font-semibold text-amber-700">
            {info.oldestChannel}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Âge du canal le plus ancien
          </div>
        </div>

        <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
          <div className="flex items-center mb-2">
            <CalendarDays className="h-5 w-5 text-cyan-500 mr-2" />
            <h4 className="font-semibold text-gray-800">
              Canal le plus récent
            </h4>
          </div>
          <div className="text-lg font-semibold text-cyan-700">
            {info.youngestChannel}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            Âge du canal le plus récent
          </div>
        </div>
      </div>
    </Card>
  );
}

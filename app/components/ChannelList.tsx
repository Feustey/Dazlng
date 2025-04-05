"use client";

import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  ChevronRight,
  Search,
  ArrowUpDown,
  Filter,
  ExternalLink,
} from "lucide-react";

interface Channel {
  id: string;
  remoteNodeId: string;
  capacity: number;
  age: string;
}

interface ChannelListProps {
  channels: Channel[];
}

export default function ChannelList({ channels }: ChannelListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"capacity" | "age">("capacity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const formatSats = (sats: number) => {
    if (sats >= 100000000) {
      return `${(sats / 100000000).toFixed(2)} BTC`;
    } else if (sats >= 1000) {
      return `${(sats / 1000).toFixed(0)}k sats`;
    }
    return `${sats} sats`;
  };

  // Filtrer les canaux en fonction du terme de recherche
  const filteredChannels = channels.filter(
    (channel) =>
      channel.remoteNodeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Trier les canaux
  const sortedChannels = [...filteredChannels].sort((a, b) => {
    if (sortBy === "capacity") {
      return sortOrder === "asc"
        ? a.capacity - b.capacity
        : b.capacity - a.capacity;
    } else {
      // Pour l'âge, nous devons extraire le nombre
      const ageA = parseInt(a.age.split(" ")[0]);
      const ageB = parseInt(b.age.split(" ")[0]);
      return sortOrder === "asc" ? ageA - ageB : ageB - ageA;
    }
  });

  const toggleSort = (field: "capacity" | "age") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 md:mb-0">
          Liste des Canaux
        </h3>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un canal..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Nœud distant</th>
              <th className="p-3 text-left">
                <button
                  className="flex items-center hover:text-orange-600 transition-colors"
                  onClick={() => toggleSort("capacity")}
                >
                  Capacité
                  {sortBy === "capacity" && (
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortOrder === "asc" ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
              </th>
              <th className="p-3 text-left">
                <button
                  className="flex items-center hover:text-orange-600 transition-colors"
                  onClick={() => toggleSort("age")}
                >
                  Âge
                  {sortBy === "age" && (
                    <ArrowUpDown
                      className={`h-4 w-4 ml-1 ${sortOrder === "asc" ? "rotate-180" : ""}`}
                    />
                  )}
                </button>
              </th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedChannels.length > 0 ? (
              sortedChannels.map((channel) => (
                <tr key={channel.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="font-medium">
                      Nœud {channel.id.split("-")[1]}
                    </div>
                    <div className="text-xs text-gray-500 break-all">
                      {channel.remoteNodeId}
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="font-medium text-orange-600">
                      {formatSats(channel.capacity)}
                    </span>
                  </td>
                  <td className="p-3">{channel.age}</td>
                  <td className="p-3">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">
                  Aucun canal ne correspond à votre recherche
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sortedChannels.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Affichage de {sortedChannels.length} sur {channels.length} canaux
        </div>
      )}
    </Card>
  );
}

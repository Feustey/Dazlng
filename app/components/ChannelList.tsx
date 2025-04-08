"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

interface Channel {
  id: string;
  remoteNodeId: string;
  capacity: number;
  age: number;
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

  const filteredChannels = channels.filter((channel) =>
    channel.remoteNodeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedChannels = [...filteredChannels].sort((a, b) => {
    const multiplier = sortOrder === "asc" ? 1 : -1;
    if (sortBy === "capacity") {
      return (a.capacity - b.capacity) * multiplier;
    }
    return (a.age - b.age) * multiplier;
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
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Rechercher un nœud..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Nœud distant</th>
              <th className="text-right py-2">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("capacity")}
                  className="flex items-center gap-1"
                >
                  Capacité
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </th>
              <th className="text-right py-2">
                <Button
                  variant="ghost"
                  onClick={() => toggleSort("age")}
                  className="flex items-center gap-1"
                >
                  Âge
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedChannels.map((channel) => (
              <tr key={channel.id} className="border-b">
                <td className="py-2 font-mono text-sm break-all">
                  {channel.remoteNodeId}
                </td>
                <td className="py-2 text-right">
                  {formatSats(channel.capacity)}
                </td>
                <td className="py-2 text-right">{channel.age} mois</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

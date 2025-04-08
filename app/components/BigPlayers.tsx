"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { networkService } from "../services/networkService";
import { NetworkNode } from "../types/network";
import { Skeleton } from "./ui/skeleton";

interface PlayerRowProps {
  node: NetworkNode;
  showCapacity?: boolean;
}

const PlayerRow = ({ node, showCapacity = false }: PlayerRowProps) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-card/50 transition-colors"
    role="listitem"
  >
    <div className="flex items-center gap-4">
      <span className="text-muted-foreground w-6">{node.rank || 0}.</span>
      <span className="font-medium">{node.alias}</span>
    </div>
    <span className="font-mono font-medium">
      {showCapacity ? `${node.capacity}` : node.channelCount}
    </span>
  </motion.div>
);

const LoadingSkeleton = () => (
  <div className="space-y-4">
    {[...Array(7)].map((_, i) => (
      <div key={i} className="flex items-center justify-between py-3 px-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
    ))}
  </div>
);

export default function BigPlayers() {
  const [period, setPeriod] = useState<"daily" | "weekly">("daily");
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        setIsLoading(true);
        const data = await networkService.getTopNodes(period);
        setNodes(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching top nodes:", err);
        setError("Impossible de charger les données du réseau");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNodes();
  }, [period]);

  const byChannels = [...nodes]
    .sort((a, b) => b.channelCount - a.channelCount)
    .slice(0, 7)
    .map((node, index) => ({ ...node, rank: index + 1 }));

  const byCapacity = [...nodes]
    .sort((a, b) => b.capacity - a.capacity)
    .slice(0, 7)
    .map((node, index) => ({ ...node, rank: index + 1 }));

  return (
    <Card className="backdrop-blur-sm bg-card/80">
      <CardHeader>
        <CardTitle>Big Players</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={period}
          onValueChange={(v) => setPeriod(v as "daily" | "weekly")}
          className="space-y-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>

          {error ? (
            <div className="text-destructive text-center py-4">{error}</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">By Channels</h3>
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="space-y-1">
                    {byChannels.map((node) => (
                      <PlayerRow key={node.publicKey} node={node} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">By Capacity</h3>
                {isLoading ? (
                  <LoadingSkeleton />
                ) : (
                  <div className="space-y-1">
                    {byCapacity.map((node) => (
                      <PlayerRow
                        key={node.publicKey}
                        node={node}
                        showCapacity
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}

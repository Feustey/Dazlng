"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "../ui/card";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";

interface Operation {
  id: string;
  type: "channel_open" | "channel_close" | "payment" | "invoice";
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  startTime: number;
  endTime?: number;
  details: {
    amount?: number;
    channelId?: string;
    nodeId?: string;
    invoice?: string;
    error?: string;
  };
}

export const OperationTracker: React.FC = () => {
  const t = useTranslations("Operations");
  const [operations, setOperations] = useState<Operation[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Simuler le chargement des opérations
    const mockOperations: Operation[] = [
      {
        id: "1",
        type: "channel_open",
        status: "processing",
        progress: 45,
        startTime: Date.now() - 3600000,
        details: {
          amount: 1000000,
          nodeId: "node1",
        },
      },
      {
        id: "2",
        type: "payment",
        status: "completed",
        progress: 100,
        startTime: Date.now() - 7200000,
        endTime: Date.now() - 7100000,
        details: {
          amount: 50000,
          invoice: "lnbc...",
        },
      },
    ];

    setOperations(mockOperations);
  }, []);

  const getStatusColor = (status: Operation["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "failed":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatDuration = (startTime: number, endTime?: number) => {
    const duration = (endTime || Date.now()) - startTime;
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const handleCancel = (operationId: string) => {
    setOperations((ops) =>
      ops.map((op) =>
        op.id === operationId
          ? { ...op, status: "failed", progress: 0, endTime: Date.now() }
          : op
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{t("title")}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("activeOperations")}
          </h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {operations
                .filter(
                  (op) => op.status === "processing" || op.status === "pending"
                )
                .map((operation) => (
                  <Card key={operation.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">
                          {t(`types.${operation.type}`)}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {t("started")}:{" "}
                          {new Date(operation.startTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(operation.status)}>
                        {t(`status.${operation.status}`)}
                      </Badge>
                    </div>
                    <Progress value={operation.progress} className="mb-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm">
                        {t("duration")}: {formatDuration(operation.startTime)}
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(operation.id)}
                      >
                        {t("cancel")}
                      </Button>
                    </div>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t("completedOperations")}
          </h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {operations
                .filter(
                  (op) => op.status === "completed" || op.status === "failed"
                )
                .map((operation) => (
                  <Card key={operation.id} className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">
                          {t(`types.${operation.type}`)}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {t("completed")}:{" "}
                          {new Date(operation.endTime!).toLocaleTimeString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(operation.status)}>
                        {t(`status.${operation.status}`)}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      <p>
                        {t("duration")}:{" "}
                        {formatDuration(operation.startTime, operation.endTime)}
                      </p>
                      {operation.details.error && (
                        <p className="text-red-500">
                          {operation.details.error}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
};

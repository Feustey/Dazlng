import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

interface Node {
  id: string;
  name: string;
  capacity: string;
  channels: number;
  age: string;
  status: "active" | "inactive";
}

interface NodeListProps {
  nodes: Node[];
  onViewDetails: (nodeId: string) => void;
  onManageChannels: (nodeId: string) => void;
}

export function NodeList({
  nodes,
  onViewDetails,
  onManageChannels,
}: NodeListProps) {
  const t = useTranslations("Network");

  return (
    <div className="space-y-4">
      {nodes.map((node) => (
        <Card key={node.id} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">{node.name}</h3>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <span className="text-sm text-gray-500">
                    {t("dashboard.capacity")}:
                  </span>
                  <span className="ml-2">{node.capacity}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    {t("dashboard.channels")}:
                  </span>
                  <span className="ml-2">{node.channels}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">
                    {t("dashboard.age")}:
                  </span>
                  <span className="ml-2">{node.age}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status:</span>
                  <span
                    className={`ml-2 ${node.status === "active" ? "text-green-500" : "text-red-500"}`}
                  >
                    {node.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => onViewDetails(node.id)}>
                {t("actions.viewDetails")}
              </Button>
              <Button
                variant="default"
                onClick={() => onManageChannels(node.id)}
              >
                {t("actions.manageChannels")}
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

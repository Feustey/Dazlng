import { useTranslations } from "next-intl";
import { formatSats } from "@/app/utils/format";

interface NetworkNode {
  publicKey: string;
  alias: string;
  channelCount: number;
  capacity: number;
}

interface TopNodesProps {
  nodes: NetworkNode[];
}

export default function TopNodes({ nodes }: TopNodesProps) {
  const t = useTranslations("Network");

  return (
    <div className="space-y-4">
      {nodes.map((node) => (
        <div
          key={node.publicKey}
          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
        >
          <div>
            <p className="font-medium">{node.alias}</p>
            <p className="text-sm text-muted-foreground">
              {node.channelCount} {t("channels")}
            </p>
          </div>
          <p className="font-medium">{formatSats(node.capacity)}</p>
        </div>
      ))}
    </div>
  );
}

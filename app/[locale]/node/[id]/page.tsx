import { Metadata } from "next";
import NodeDetails from "@/app/components/NodeDetails";

export const metadata: Metadata = {
  title: "Détails du Nœud Lightning Network | DazLng",
  description:
    "Visualisez les détails complets d'un nœud Lightning Network, y compris ses canaux, statistiques et performance.",
};

interface NodePageProps {
  params: {
    id: string;
  };
}

export default function NodePage({ params }: NodePageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <NodeDetails nodeId={params.id} />
    </div>
  );
}

import { Metadata } from "next";
import NodeDetails from "@/app/components/NodeDetails";

export const metadata: Metadata = {
  title: "Nœud Feustey | DazLng",
  description: "Détails du nœud Lightning Network Feustey",
};

interface NodePageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function NodePage({ params }: NodePageProps) {
  return (
    <div className="container mx-auto py-8">
      <NodeDetails />
    </div>
  );
}

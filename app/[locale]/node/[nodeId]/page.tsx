import { Suspense } from "react";
import NodeDetails from "./NodeDetails";
import { Loader2 } from "lucide-react";

type Props = {
  params: {
    nodeId: string;
    locale: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

async function getNode(nodeId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/node/${nodeId}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch node");
  }
  return response.json();
}

export default function NodePage({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <NodeDetails nodeId={params.nodeId} />
    </Suspense>
  );
}

export const dynamic = "force-dynamic";
import { MCPClient } from "@/lib/mcp-client";
import { useTranslations } from "next-intl";

export default async function Page(): Promise<JSX.Element> {
  const client = MCPClient.getInstance();
  const summary = await client.getNetworkSummary();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Résumé du réseau</h1>
      <pre>
        {JSON.stringify(summary, null, 2)}
      </pre>
    </div>
  );
}

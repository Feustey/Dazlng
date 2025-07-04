import { MCPClient } from "@/lib/mcp-client";
import { notFound } from "next/navigation";

export default async function Page(): Promise<JSX.Element> {
  const id = "demo-id"; // Remplacer par la vraie récupération de l'id
  const client = MCPClient.getInstance();
  
  try {
    const [stats, history] = await Promise.all([
      client.getNodeStats(id),
      client.getNodeHistory(id)
    ]);
    
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Node {id}</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl mb-2">Statistiques</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(stats, null, 2)}
              </pre>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl mb-2">Historique</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(history, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

export const dynamic = "force-dynamic";

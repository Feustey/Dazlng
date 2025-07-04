import { createSupabaseServerClient } from "@/lib/supabase-auth";
import { useAdvancedTranslation } from "@/hooks/useAdvancedTranslation";

export const dynamic = "force-dynamic";

// Définition de l'interface Instrument selon la table SQL
export interface Instrument {
  id: number;
  name: string;
  created_at: string;
}

export default async function Instruments(): Promise<JSX.Element> {
  const supabase = await createSupabaseServerClient();
  
  try {
    const { data: instruments, error } = await supabase
      .from("instruments")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erreur Supabase:", error);
      return (
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Test Supabase Instruments</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Erreur</strong> {error.message}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Test Supabase Instruments</h1>
          
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            <strong>Succès</strong> Connexion Supabase établie avec succès.
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Liste des instruments</h2>
            
            {instruments && instruments.length > 0 ? (
              <div>
                <ul className="space-y-2">
                  {(instruments as Instrument[]).map((instrument: Instrument) => (
                    <li key={instrument.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-medium">{instrument.name}</span>
                      <span className="text-sm text-gray-500">ID: {instrument.id}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-gray-500">
                Aucun instrument trouvé dans la base de données.
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-2">Données brutes JSON</h3>
            <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
              {JSON.stringify(instruments, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Erreur lors de la récupération des instruments:", error);
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Test Supabase Instruments</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur inattendue</strong> {error instanceof Error ? error.message : "Erreur inconnue"}
          </div>
        </div>
      </div>
    );
  }
}

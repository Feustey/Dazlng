import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// Définition de l'interface Instrument selon la table SQL
interface Instrument {
  id: number;
  name: string;
  created_at: string;
}

export default async function Instruments(): Promise<JSX.Element> {
  const supabase = await createClient(await cookies());
  
  try {
    const { data: instruments, error } = await supabase
      .from("instruments")
      .select("*")
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur Supabase:', error);
      return (
        <div className="container mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">Test Supabase - Instruments</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Erreur:</strong> {error.message}
          </div>
        </div>
      );
    }

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Test Supabase - Instruments</h1>
        
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          <strong>Succès!</strong> Connexion Supabase établie avec succès.
        </div>

        <div className="grid gap-4">
          <h2 className="text-xl font-semibold">Liste des instruments:</h2>
          
          {instruments && instruments.length > 0 ? (
            <div className="bg-white shadow rounded-lg p-6">
              <ul className="space-y-2">
                {(instruments as Instrument[]).map((instrument: Instrument) => (
                  <li 
                    key={instrument.id} 
                    className="flex justify-between items-center p-3 bg-gray-50 rounded"
                  >
                    <span className="font-medium">{instrument.name}</span>
                    <span className="text-sm text-gray-500">ID: {instrument.id}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              Aucun instrument trouvé dans la base de données.
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Données brutes (JSON):</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(instruments, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erreur lors de la récupération des instruments:', error);
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Test Supabase - Instruments</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur inattendue:</strong> {error instanceof Error ? error.message : 'Erreur inconnue'}
        </div>
      </div>
    );
  }
} 
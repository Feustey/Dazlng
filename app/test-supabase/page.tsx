import { createSupabaseServerClient } from "@/lib/supabase-auth";

export const dynamic = "force-dynamic";
export default async function TestSupabase(): Promise<JSX.Element> {
  const supabase = await createSupabaseServerClient();
  
  // Test de connexion basique
  const connectionTest = async (): Promise<{ success: boolean; error: string | null }> => {
    try {
      const { /* data, */ /* error */ } = await supabase.from("profiles").select("count").limit(1);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" };
    }
  };

  const connection = await connectionTest();

  // Test des tables existantes
  const testTables = async (): Promise<{ table: string; status: string; error?: string }[]> => {
    const tables = ["profiles", "orders", "payments", "subscriptions", "prospects"];
    const results = [];

    for (const table of tables) {
      try {
        const { /* data, */ error } = await supabase.from(table).select("count").limit(1);
        results.push({
          table,
          status: error ? "erreur" : "ok", 
          error: error?.message 
        });
      } catch (error) {
        results.push({
          table,
          status: "erreur", 
          error: error instanceof Error ? error.message : "Erreur inconnue"
        });
      }
    }

    return results;
  };

  const tableResults = await testTables();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Diagnostic Supabase</h1>
      
      {/* Test de connexion */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Test de connexion</h2>
        <div>
          {connection.success ? (
            <span>✅ Connexion Supabase réussie</span>
          ) : (
            <span>❌ Échec de connexion: {connection.error}</span>
          )}
        </div>
      </div>

      {/* Test des tables */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Test des tables</h2>
        <div>
          {tableResults.map((result: any) => (
            <div key={result.table}>
              <span className="font-medium">{result.table}</span>
              <span>
                {result.status === "ok" ? "✅ OK" : `❌ ${result.error}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Variables d'environnement */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Variables d'environnement</h2>
        <div>
          <div>
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_URL</strong> {
                process.env.NEXT_PUBLIC_SUPABASE_URL ?? "" ? "✅ Définie" : "❌ Manquante"
              }
            </div>
            <div>
              <strong>NEXT_PUBLIC_SUPABASE_ANON_KEY</strong> {
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "" ? "✅ Définie" : "❌ Manquante"
              }
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div>
        <h3 className="font-semibold mb-3">Instructions pour tester</h3>
        <ol>
          <li>Assurez-vous que vos variables d'environnement sont définies</li>
          <li>Exécutez la migration SQL pour créer les tables</li>
          <li>Visitez <code className="bg-white px-2 py-1 rounded">/instruments</code> pour tester la lecture des données</li>
          <li>Vérifiez que toutes les tables sont accessibles</li>
        </ol>
      </div>
    </div>
  );
}
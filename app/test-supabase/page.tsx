import { createSupabaseServerClient } from '@/lib/supabase-auth';

export const dynamic = 'force-dynamic';
export default async function TestSupabase(): Promise<JSX.Element> {
  const supabase = await createSupabaseServerClient();
  
  // Test de connexion basique
  const connectionTest = async (): Promise<{ success: boolean; error: string | null }> => {
    try {
      const { /* data, */ /* error */ } = await supabase.from('profiles').select('count').limit(1);
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
    }
  };

  const connection = await connectionTest();

  // Test des tables existantes
  const testTables = async (): Promise<{ table: string; status: string; error?: string }[]> => {
    const tables = ['profiles', 'orders', 'payments', 'subscriptions', 'prospects'];
    const results = [];

    for (const table of tables) {
      try {
        const { /* data, */ error } = await supabase.from(table).select('count').limit(1);
        results.push({ 
          table, 
          status: error ? 'erreur' : 'ok', 
          error: error?.message 
        });
      } catch (error) {
        results.push({ 
          table, 
          status: 'erreur', 
          error: error instanceof Error ? error.message : 'Erreur inconnue' 
        });
      }
    }

    return results;
  };

  const tableResults = await testTables();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">{t('common.diagnostic_supabase')}</h1>
      
      {/* Test de connexion */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('common.test_de_connexion')}</h2>
        <div className={`p-4 rounded ${connection.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {connection.success ? (
            <span>{t('common._connexion_supabase_russie')}</span>
          ) : (
            <span>❌ Échec de connexion: {connection.error}</span>
          )}
        </div>
      </div>

      {/* Test des tables */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('common.test_des_tables')}</h2>
        <div className="grid gap-3">
          {tableResults.map((result: any) => (
            <div 
              key={result.table}
              className={`p-3 rounded flex justify-between items-center ${
                result.status === 'ok' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              <span className="font-medium">{result.table}</span>
              <span>
                {result.status === 'ok' ? '✅ OK' : `❌ ${result.error}`}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Variables d'environnement */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">{t('common.variables_denvironnement')}</h2>
        <div className="bg-gray-100 p-4 rounded">
          <div className="grid gap-2">
            <div>
              <strong>{t('common.next_public_supabase_url')}</strong> {
                process.env.NEXT_PUBLIC_SUPABASE_URL ?? "" ? '✅ Définie' : '❌ Manquante'
              }
            </div>
            <div>
              <strong>{t('common.next_public_supabase_anon_key')}</strong> {
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "" ? '✅ Définie' : '❌ Manquante'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-6 rounded">
        <h3 className="font-semibold mb-3">{t('common.instructions_pour_tester')}</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>{t('common.assurezvous_que_vos_variables_')}</li>
          <li>{t('common.excutez_la_migration_sql_pour_')}</li>
          <li>Visitez <code className="bg-white px-2 py-1 rounded">{t('common.instruments')}</code>{t('common._pour_tester_la_lecture_des_do')}</li>
          <li>{t('common.vrifiez_que_toutes_les_tables_')}</li>
        </ol>
      </div>
    </div>
  );
}

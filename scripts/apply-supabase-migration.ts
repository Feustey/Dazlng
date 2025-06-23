import { getSupabaseAdminClient } from '../lib/supabase';
import fs from 'fs';
import path from 'path';

interface MigrationResult {
  file: string;
  success: boolean;
  error?: any;
  duration: number;
}

async function executeMigration(sql: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  await supabase.rpc('exec_sql', { sql });
}

async function backupTable(tableName: string): Promise<void> {
  const supabase = getSupabaseAdminClient();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupTable = `${tableName}_backup_${timestamp}`;
  
  await supabase.rpc('exec_sql', {
    sql: `CREATE TABLE IF NOT EXISTS ${backupTable} AS SELECT * FROM ${tableName};`
  });
}

async function main() {
  const results: MigrationResult[] = [];
  const migrationPath = path.join(process.cwd(), 'supabase', 'migrations', '20240527000000_add_performance_indexes.sql');

  try {
    console.log('🔄 Starting migration process...\n');

    // 1. Lecture du fichier de migration
    console.log('📖 Reading migration file...');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // 2. Backup des tables concernées
    console.log('\n📦 Creating backups...');
    const tablesToBackup = ['users', 'orders', 'payments', 'subscriptions', 'deliveries', 'prospects', 'network_stats'];
    
    for (const table of tablesToBackup) {
      console.log(`   Backing up ${table}...`);
      await backupTable(table);
    }

    // 3. Exécution de la migration
    console.log('\n⚡ Executing migration...');
    const start = Date.now();
    
    try {
      await executeMigration(migrationSQL);
      
      results.push({
        file: '20240527000000_add_performance_indexes.sql',
        success: true,
        duration: Date.now() - start
      });
    } catch (error) {
      results.push({
        file: '20240527000000_add_performance_indexes.sql',
        success: false,
        error,
        duration: Date.now() - start
      });
    }

    // 4. Vérification des index
    console.log('\n🔍 Verifying indexes...');
    const supabase = getSupabaseAdminClient();
    
    // Vérifier que les index ont été créés
    const { data: indexes, error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT schemaname, tablename, indexname 
        FROM pg_indexes 
        WHERE schemaname = 'public'
        AND indexname LIKE 'idx_%';
      `
    });

    if (indexError) {
      throw new Error(`Failed to verify indexes: ${indexError.message}`);
    }

    // 5. Afficher les résultats
    console.log('\n📊 Migration Results:');
    console.log('===================\n');

    results.forEach(result => {
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${result.file} (${result.duration}ms)`);
      
      if (!result.success) {
        console.log(`   Error: ${result.error?.message || result.error}`);
      }
    });

    // 6. Vérifier les index créés
    console.log('\n📑 Created Indexes:');
    console.log('=================\n');
    
    if (indexes && Array.isArray(indexes)) {
      indexes.forEach((idx: any) => {
        console.log(`✓ ${idx.indexname} on ${idx.tablename}`);
      });
    }

    // 7. Résumé final
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log('\n📈 Summary:');
    console.log(`✅ ${successful} migrations successful`);
    console.log(`❌ ${failed} migrations failed`);
    console.log(`📦 ${tablesToBackup.length} tables backed up`);
    console.log(`📑 ${indexes?.length || 0} indexes verified`);

    if (failed > 0) {
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Exécuter la migration
console.log('🚀 Starting Supabase migration process...\n');
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 
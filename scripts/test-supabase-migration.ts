import { getSupabaseAdminClient } from '../lib/supabase';
import { User, Order, Payment, Subscription } from '../types/database';

interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL';
  error?: any;
  duration: number;
}

async function runTest(name: string, testFn: () => Promise<void>): Promise<TestResult> {
  const start = Date.now();
  try {
    await testFn();
    return {
      name,
      status: 'PASS',
      duration: Date.now() - start
    };
  } catch (error) {
    return {
      name,
      status: 'FAIL',
      error,
      duration: Date.now() - start
    };
  }
}

async function main() {
  const supabase = getSupabaseAdminClient();
  const results: TestResult[] = [];

  // Test 1: Création utilisateur
  results.push(await runTest('Création utilisateur', async () => {
    const userData = {
      email: `test${Date.now()}@example.com`,
      name: 'Test User',
      company: 'Test Company'
    };

    const { data, error } = await supabase
      .from('users')
      .insert([userData])
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('No user created');

    // Cleanup
    await supabase.from('users').delete().eq('id', data.id);
  }));

  // Test 2: Pagination des commandes
  results.push(await runTest('Pagination des commandes', async () => {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .range(0, 9);

    if (error) throw error;
    if (!orders) throw new Error('No orders returned');
  }));

  // Test 3: Performance des index
  results.push(await runTest('Performance des index', async () => {
    const start = Date.now();
    
    const promises = [
      // Test index sur email
      supabase.from('users').select('*').eq('email', 'test@example.com'),
      // Test index sur user_id
      supabase.from('orders').select('*').eq('user_id', 'some-id'),
      // Test index sur created_at
      supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(10)
    ];

    await Promise.all(promises);
    
    const duration = Date.now() - start;
    if (duration > 1000) {
      throw new Error(`Queries took too long: ${duration}ms`);
    }
  }));

  // Test 4: Contraintes de clés étrangères
  results.push(await runTest('Contraintes de clés étrangères', async () => {
    try {
      await supabase
        .from('orders')
        .insert([{ user_id: 'non-existent-user' }]);
      
      throw new Error('Foreign key constraint not enforced');
    } catch (error: any) {
      if (!error.message.includes('foreign key constraint')) {
        throw new Error('Unexpected error: ' + error.message);
      }
    }
  }));

  // Test 5: Pagination avec tri
  results.push(await runTest('Pagination avec tri', async () => {
    const page = 1;
    const pageSize = 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, count, error } = await supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .range(start, end)
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data || !count) throw new Error('Pagination failed');
  }));

  // Afficher les résultats
  console.log('\nRésultats des tests:');
  console.log('===================\n');

  let passed = 0;
  let failed = 0;

  results.forEach(result => {
    const status = result.status === 'PASS' ? '✅' : '❌';
    console.log(`${status} ${result.name} (${result.duration}ms)`);
    
    if (result.status === 'FAIL') {
      console.log(`   Error: ${result.error?.message || result.error}`);
      failed++;
    } else {
      passed++;
    }
  });

  console.log('\nRésumé:');
  console.log(`✅ ${passed} tests passed`);
  console.log(`❌ ${failed} tests failed`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Error running tests:', error);
  process.exit(1);
}); 
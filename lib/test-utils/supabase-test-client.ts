import { getSupabaseAdminClient } from '@/lib/supabase';

// Configuration pour les tests
const TEST_EMAIL = 'stephane.courant@pm.me';
const TEST_NAME = 'Stéphane Courant';
const TEST_PUBKEY = '03eec7245d6b7d2ccb30380bfbe2a3648cd7a942653f5aa340edcea1f283686619';

export interface TestResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARN';
  message: string;
  details?: any;
  duration?: number;
}

/**
 * Crée un client Supabase pour les tests avec gestion d'erreurs
 */
export function createTestClient() {
  try {
    return getSupabaseAdminClient();
  } catch (error) {
    console.error('❌ Erreur création client test:', error);
    throw error;
  }
}

export { TEST_EMAIL, TEST_NAME, TEST_PUBKEY };
export type { TestResult }; 
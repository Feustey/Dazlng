import { createClient } from '@supabase/supabase-js';
import { useMemo } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function useSupabase() {
  return useMemo(() => createClient(supabaseUrl, supabaseAnonKey), []);
} 